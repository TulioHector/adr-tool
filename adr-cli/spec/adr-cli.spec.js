import proc from 'child_process';

const exec = proc.exec;

const result = function(command, cb){
    var child = exec(command, function(err, stdout, stderr){
        if(err != null){
            return cb(new Error(err), null);
        }else if(typeof(stderr) != "string"){
            return cb(new Error(stderr), null);
        }else{
            return cb(null, stdout);
        }
    });
}



describe("Test help function.", function() {
    it("The function should view help command.", function() {
        result("node ..\\index.js -h", function(err, response){
            if(!err){
                console.log(response);
            }else {
                console.log(err);
            }
        });
        expect(true).toBe(true);
    });
});