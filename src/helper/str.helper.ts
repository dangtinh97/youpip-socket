var mongoose = require('mongoose');
class StrHelper {
    static toObjectId(value:String)
    {
        try {
            return new mongoose.Types.ObjectId(value);
        }catch (e) {
            console.log(e)
            return null
        }

    }
}
export default StrHelper
