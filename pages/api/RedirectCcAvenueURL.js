var ccavenue = require('ccavenue-iframe')
async function handler(req, res) {
if(req.method=="POST"){

try {
    // To GET Response
              ccavenue.getresponse(request, response,function(success){
                          console.log(success);
                 });

    } catch (error) {
    console.log(error)
        res.status(500).send(error);
    }
}
}
export default handler

