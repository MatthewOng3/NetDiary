import DOMPurify from "dompurify";

//Cleans user input data
function cleanInputData(input){
    return DOMPurify.sanitize(input, {FORBID_TAGS: ['style', 'img', 'a', 'button', 'link']})
}

export default cleanInputData;