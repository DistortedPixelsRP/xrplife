XRPLifeServer = {}
XRPLifeServer.Helpers = {}

XRPLifeServer.Helpers.PlayerIdentifier = function(type, id)
    local identifiers = {}
    local numIdentifiers = GetNumPlayerIdentifiers(id)

    for a = 0, numIdentifiers do
        table.insert(identifiers, GetPlayerIdentifier(id, a))
    end

    for b = 1, #identifiers do
        if string.find(identifiers[b], type, 1) then
            return identifiers[b]
        end
    end
    return false
end

XRPLifeServer.Helpers.DebugMessage = function(message)
    print(tostring("[XRPLife Debug]: " .. message))
end

XRPLifeServer.Helpers.DebugMessage("Helpers - server.lua Loaded")