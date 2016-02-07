/**
 * Created by Dimitar on 2/5/2016.
 */
quizGenerator.service('dateParser',function(){

    return {
        parseDates : function(date) {
            return date.split(' ')[0];
        }
    }

});