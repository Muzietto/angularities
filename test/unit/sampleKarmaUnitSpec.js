
describe('A spec suite', function() {
  beforeEach(function() {
    jasmine.addMatchers({
     toBeMoreThanOrEqual: function() {
       return {
         compare: function(actual, expected) {
           return {
             pass: (actual >= expected) // what a pile of CRAP!!!
           }
         }
       }
     }
    });
  });

  it('contains a perfectly passing spec', function() {
  expect(true).toBe(true);
  });

  it('checks the custom matcher', function() {
    expect(6).toBeMoreThanOrEqual(-123);
  });
});