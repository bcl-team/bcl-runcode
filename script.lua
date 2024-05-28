Script = {}
Script.__index = Script

local function getTs()
    if (IsDuplicityVersion()) then
        local date = os.date('*t')
        return string.format('%02d:%02d:%02d', date.hour, date.min, date.sec)
    else
        local year, month, day, hour, minute, second = GetLocalTime()
        return string.format('%02d:%02d:%02d', hour, minute, second)
    end
end

local function patchConsole(script)
    local function createLogger(method)
        return function(...)
            local messages = { ... }
            print(table.concat(messages, ' '))
            for _, handler in ipairs(script._events.out) do
                handler({ id = script.id, method = method, data = messages, timestamp = getTs() })
            end
        end
    end

    script._globals.print = createLogger('log')
    script._globals.printError = createLogger('error')
end

local function patchGlobals(disposables)
    local globals = {}

    globals.AddEventHandler = function(eventName, handler)
        local cookie = _G.AddEventHandler(eventName, handler)
        table.insert(disposables, function()
            _G.RemoveEventHandler(cookie)
        end)
    end

    globals.RegisterNetEvent = function(eventName, handler)
        _G.RegisterNetEvent(eventName)
        local cookie = _G.AddEventHandler(eventName, handler)
        table.insert(disposables, function()
            _G.RemoveEventHandler(cookie)
        end)
    end

    globals.RegisterCommand = function(commandName, handler)
        local active = true
        _G.RegisterCommand(commandName, function(...)
            if active then
                handler(...)
            end
        end)
        table.insert(disposables, function()
            active = false
        end)
    end

    local ticks = {}

    globals.clearTick = function(tickId)
        local hadTick = ticks[tickId]
        ticks[tickId] = nil
        return hadTick
    end

    globals.setTick = function(handler)
        local tickId = {}
        ticks[tickId] = true
        Citizen.CreateThread(function()
            while ticks[tickId] do
                handler()
                Citizen.Wait(0)
            end
        end)
        table.insert(disposables, function()
            globals.clearTick(tickId)
        end)
        return tickId
    end

    return globals
end

function Script.new(id, context)
    local self = setmetatable({}, Script)
    self.id = id
    self._context = context or function()
        return {}
    end
    self._disposables = {}
    self._globals = patchGlobals(self._disposables)
    patchConsole(self)
    self._events = {
        out = {},
        error = {}
    }

    return self
end

function Script:execute(code)
    local context = self._context()
    local env = setmetatable({}, { __index = function(_, key)
        return context[key] or self._globals[key] or _G[key]
    end })

    local func, err = load(code, 'script', 't', env)
    if not func then
        self._globals.printError(err)
        for _, handler in ipairs(self._events.error) do
            handler(err)
        end
        return
    end

    local success, res = pcall(func)
    if not success then
        self._globals.printError('Result:', res)
        for _, handler in ipairs(self._events.error) do
            handler(res)
        end
        return
    end

    self._globals.print('Result:', res or "nil")
end

function Script:cleanup()
    for _, disposable in ipairs(self._disposables) do
        disposable()
    end
    self._disposables = {}
end

function Script:on(eventName, handler)
    table.insert(self._events[eventName], handler)
end

