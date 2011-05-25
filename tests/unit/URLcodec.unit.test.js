var testFixture = require('nodeunit').testCase;
var URLcodec = require('../../lib/URLcodec');

exports['URLcodec'] = testFixture({
    setUp: function (callback) {
        // Do set up
        callback();
    },

    tearDown: function (callback) {
        // Clean up
        callback();
    },

    'Should generate valid unique IDs' : function(test){
        test.expect(2);
        
        var id = URLcodec.generateUID();
        
        test.equal(typeof id,"number");
        test.ok(id > 0);
        test.done();
    },

    'Should generate unique IDs when called several times in a row' : function(test){
        test.expect(1);
        
        var id1 = URLcodec.generateUID();
        var id2 = URLcodec.generateUID();
        
        test.notEqual(id1,id2);
        test.done();
    },

    'Encoding function should be bijective' : function(test){
        test.expect(1);
        
        var id = URLcodec.generateUID();
        var encoded = URLcodec.encode(id);
        var decoded = URLcodec.decode(encoded)

        test.equal(id, decoded);
        test.done();
    }    
    
});

