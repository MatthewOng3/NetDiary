//Validates URL and returns true if its good and false if its bad
function validateURL(url) {
	const parsed = new URL(url)
    // try {
    //     let givenURL = new URL(url);
    // } catch (error) {
    //     console.log("error is",error)
    //   	return false;  
    // }
    // return givenURL.protocol === "https:";
	return ['https:'].includes(parsed.protocol)
}

export default validateURL;