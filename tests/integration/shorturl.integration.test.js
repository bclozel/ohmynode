var createJSON = "{\"url\":\"http://google.fr\"}";
var createOtherJSON = "{\"url\":\"http://www.slashdot.org\"}";
var newShortKey = '';

var http = require('http');
var TestFixture = require('nodeunit').testCase;

module.exports['HTTP Method'] = TestFixture({
    setUp: function (callBack) {

        this.localhost = http.createClient(3000, 'localhost');

        this.requestHelper = function(request, fn){
            request.end();

            request.on('response', function (response) {
                var responseBody = "";
                response.setEncoding('utf8');

                response.addListener("data", function(chunk) {
                    responseBody += chunk;
                });

                response.on('end', function() {
                    response.body = responseBody;
                    fn(response);
                });
            });
        };

        callBack();
    },

    tearDown: function (callBack) {
        // clean up
        callBack();
    },


    'POST Should create a new ShortURL' : function(test){
        test.expect(3);

        var request = this.localhost.request('POST', '/shorturls.json', {'Host': 'localhost', 'Accept': 'application/json', 'Content-Type': 'application/json'});
        request.write(createJSON);

        this.requestHelper(request, function(response){
            var actualShortURL = JSON.parse(response.body);
            var expectedShortURL = JSON.parse(createJSON);

            newShortKey = actualShortURL.shortkey;

            test.ok(newShortKey != null);
            test.equals(expectedShortURL.url, actualShortURL.url);
            test.equals(response.statusCode, 201);

            test.done();
        });
    },
   
    'GET Should return a single ShortURL when calling /shorturls/{shortkey}.json' : function(test){
        test.expect(3);

        var request = this.localhost.request('GET', '/shorturls/' + newShortKey + '.json', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            var actualShortURL = JSON.parse(response.body);
            var expectedShortURL = JSON.parse(createJSON);

            test.equals(actualShortURL.url, expectedShortURL.url);
            test.equals(actualShortURL.shortkey, newShortKey);

            test.equals(response.statusCode, 200);
            test.done();
        });
    },
    
    'GET Should get a Redirect when calling /shorturls/{shortkey}' : function(test){
        test.expect(2);

        var request = this.localhost.request('GET', '/shorturls/' + newShortKey, {'Host': 'localhost', 'Accept': 'application/json'});
        var expectedShortURL = JSON.parse(createJSON);

        this.requestHelper(request, function(response){
            test.equals(response.statusCode, 302);
            test.equals(response.headers["location"], expectedShortURL.url);
            test.done();
        });
    },
    
    'DELETE Should delete a shorturl when calling /shorturls/{shortkey}' : function(test){
        test.expect(1);

        var request = this.localhost.request('DELETE', '/shorturls/' + newShortKey, {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            test.equals(response.statusCode, 200);
            test.done();
        });
    },

/*    
    'DELETE Should return a 404 when calling /shorturls/{shortkey} with a shortkey that doesn\'t exist' : function(test){
        test.expect(1);

        var request = this.localhost.request('DELETE', '/shorturls/shorturl404', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
                    console.log(response.body);
            test.equals(response.statusCode, 404);
            test.done();
        });
    },
*/
/*
    'GET Should return a single Person when calling /People/{ID}.json' : function(test){
        test.expect(3);

        var request = this.localhost.request('GET', '/People/' + newPersonId + '.json', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            var actualPerson = JSON.parse(response.body);
            var expectedPerson = JSON.parse(createJSON);

            test.equals(expectedPerson.firstName, actualPerson.firstName);
            test.equals(expectedPerson.lastName, actualPerson.lastName);
//            test.equals(expectedPerson.dateOfBirth, actualPerson.dateOfBirth);

            test.equals(response.statusCode, 200);
            test.done();
        });
    },

    'GET Should get a Bad Request when calling /People/{ID}.xml' : function(test){
        test.expect(1);

        var request = this.localhost.request('GET', '/People/' + newPersonId + '.xml', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            test.equals(response.statusCode, 400);
            test.done();
        });
    },

    'PUT Should update an existing Person' : function(test){
        test.expect(3);

        var request = this.localhost.request('PUT', '/People/' + newPersonId, {'Host': 'localhost', 'Accept': 'application/json', 'Content-Type': 'application/json'});
        request.write(updateJSON);

        this.requestHelper(request, function(response){
            var actualPerson = JSON.parse(response.body);
            var expectedPerson = JSON.parse(updateJSON);

            test.equals(expectedPerson.firstName, actualPerson.firstName);
            test.equals(expectedPerson.lastName, actualPerson.lastName);
//            test.equals(expectedPerson.dateOfBirth, actualPerson.dateOfBirth);

            test.equals(response.statusCode, 200);

            test.done();
        });
    },

    'PUT Should return 404 when trying to Update Person That Doesn\'t Exist' : function(test){
        test.expect(2);

        var request = this.localhost.request('PUT', '/People/XXXXX', {'Host': 'localhost', 'Accept': 'application/json'});
        request.write(updateJSON);

        this.requestHelper(request, function(response){
            test.ok(response.body.length > 0);
            test.equals(response.statusCode, 404);
            test.done();
        });
    },

    'GET Should return all people when calling /People.json' : function(test){
        test.expect(2);

        var request = this.localhost.request('GET', '/People.json', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            test.equals(response.statusCode, 200);
            test.ok(response.body.length > 0);
            test.done();
        });
    },

    'GET Should return a 404 when calling /People/{ID} with an ID that doesn\'t exist' : function(test){
        test.expect(2);

        var request = this.localhost.request('GET', '/People/XXXXX.json', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            test.ok(response.body.length > 0);
            test.equals(response.statusCode, 404);
            test.done();
        });
    },

    'DELETE Should delete person when calling /People/{ID}' : function(test){
        test.expect(1);

        var request = this.localhost.request('DELETE', '/People/' + newPersonId, {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            test.equals(response.statusCode, 200);
            test.done();
        });
    },

    'DELETE Should return a 404 when calling /People/{ID} with an ID that doesn\'t exist' : function(test){
        test.expect(1);

        var request = this.localhost.request('DELETE', '/People/XXXXX', {'Host': 'localhost', 'Accept': 'application/json'});

        this.requestHelper(request, function(response){
            test.equals(response.statusCode, 404);
            test.done();
        });
    }
*/
});
