import "./Features.css";


/**
 * @description Features section of the homepage
 * @author Matt
 * @access public
 * @path /
 */
function Features() {
  return (
    <section className=" w-full py-20 flex items-center justify-center" style={{ backgroundColor: '#181717' }}>
      <div className="container">
        <h1 className="text-white text-center capitalize ">
          Save your online world
        </h1>
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
          <div className="rounded-2xl overflow-hidden bg-white h-full">
            <img className="w-full h-4/6 object-cover" src="/images/category.PNG" alt="" />
            <div className="w-full px-3 py-6">
              <h1 style={{ marginBottom: "0" }} className="text-2xl font-bold">
                {" "}
                Create and share categories
              </h1>
              <h6 style={{ marginBottom: "0" }}>
                {" "}
                Sort your favourite links like your favourite pizza restaurants and share them by just sending the category link!
              </h6>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-white">
            <img className="w-full h-4/6 object-cover" src="/images/listentry.PNG" alt="" />
            <div className="w-full px-3 py-6 ">
              <h1 style={{ marginBottom: "0" }} className="text-2xl font-bold">
                {" "}
                Quick and simple entries
              </h1>
              <h6 style={{ marginBottom: "0" }}>
                Create and name each webpage entry and just paste the link of your
                webpage
              </h6>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-white">
            <img className="w-full h-4/6" src={"/images/collection1.PNG"} alt="" />
            <div className="w-full px-3 py-6 ">
              <h1 style={{ marginBottom: "0" }} className="text-2xl font-bold">
                Multiple Collections
              </h1>
              <h6 style={{ marginBottom: "0" }}>
                Create multiple diary collections to split work and leisure and
                more
              </h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
