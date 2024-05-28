local scripts = {}

local getPlayerId = function(source)
    if IsDuplicityVersion() then
        return source
    end
    return PlayerId()
end

local function createContext(source)
    return function()
        local context = {}
        context.playerId = getPlayerId(source)
        context.playerPed = GetPlayerPed(context.playerId)
        context.currentVehicle = GetVehiclePedIsIn(context.playerPed, false)
        context.lastVehicle = GetVehiclePedIsIn(context.playerPed, true)
        context.sleep = Citizen.Wait
        context.waitUntil = function(predicate, max)
            max = max or 1 / 0
            local start = GetGameTimer()
            while not predicate() do
                if GetGameTimer() - start > max then
                    return false
                end
                Citizen.Wait(0)
            end
        end

        if not IsDuplicityVersion() then
            context.requestModel = function(model)
                if not IsModelInCdimage(model) then
                    error("Model not found: " .. model)
                end
                RequestModel(model)
                while not HasModelLoaded(model) do
                    Citizen.Wait(0)
                end
            end

            context.requestAnimDict = function(animDict)
                if not DoesAnimDictExist(animDict) then
                    error("Anim dict not found: " .. animDict)
                end
                RequestAnimDict(animDict)
                while not HasAnimDictLoaded(animDict) do
                    Citizen.Wait(0)
                end
            end

            context.serverId = GetPlayerServerId(context.playerId)
        end

        return context;
    end
end

local function runScript(id, code, source)
    if (not scripts[id]) then
        local script = Script.new(code.id, createContext(source))
        scripts[id] = script
        script:on("out", function(out)
            if (IsDuplicityVersion()) then
                TriggerClientEvent('bcl-runcode:output', source, script.id, out)
            else
                TriggerEvent('bcl-runcode:output-client', script.id, out)
            end
        end)
    else
        scripts[id]:cleanup()
    end

    local script = scripts[id]
    script:execute(code.code)
end

if IsDuplicityVersion() then
    RegisterNetEvent('bcl-runcode:run:lua:server', function(pid, code)
        local source = source
        local id = string.format("%s::%s", source, code.id)
        runScript(id, code, source)
        TriggerClientEvent('bcl-runcode:run:done-lua', source, pid)
    end)
else
    RegisterNUICallback('bcl-runcode:run:lua:client', function(data, cb)
        local id = data.id
        runScript(id, data)
        cb(true)
    end)

    local pIds = 0;
    local cbs = {}

    RegisterNetEvent('bcl-runcode:run:done-lua', function(id)
        if cbs[id] then
            cbs[id](true)
            cbs[id] = nil
        end
    end)

    RegisterNUICallback('bcl-runcode:run:lua:server', function(data, cb)
        pIds = pIds + 1
        local id = pIds
        TriggerServerEvent('bcl-runcode:run:lua:server', id, data)
        cbs[id] = cb
    end)
end