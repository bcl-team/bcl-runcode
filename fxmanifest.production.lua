game 'common'
fx_version 'cerulean'

author 'https://github.com/ivanzaida'
repository 'https://github.com/ivanzaida/ivz-dev-tools'

file 'build/ui/**/*'
file 'themes/*.json'
file 'assets/*'

ui_page 'build/ui/index.html'

shared_script 'script.lua'
shared_script 'run.lua'

client_script 'build/client.js'
server_script 'build/server.js'
