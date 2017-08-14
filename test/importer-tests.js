import { Importer } from '../app/importer/Importer';

let expect = require('chai').expect,
    importers = [{"name": "a", "import": () => { return []; }}],
    importer = Importer(importers);

describe('Importer', () => {
    it('should import known importer', () => {

        let userAuthorizedService = { "name": "a" };
        expect(importer(userAuthorizedService)).to.be.empty;
    });

    it('should throw an error when an unknown service is passed', () => {

        let userAuthorizedService = { "name": "yolo" };
        expect(importer.bind(userAuthorizedService)).to.throw(Error);
    });
});