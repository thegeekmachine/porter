'use strict';

export function Importer(importers) {

    let serviceLocator = (userAuthorizedService) => {

        return (service) => {

            return service.name === userAuthorizedService.name;
        };
    };

    return (userAuthorizedService) => {

        let byName = serviceLocator(userAuthorizedService);

        let importer = importers.find(byName);

        if (undefined === importer) {
            // raise an error
            throw new Error('Importer for ' + userAuthorizedService.name + ' not found!')
        }

        return importer.import(userAuthorizedService);
    }
}