import React from "react";
import { Link } from "react-router-dom";

function HowWorks(){
  return (
    <section className="w-full flex py-20 items-center  justify-center" id="howWorks" style={{backgroundColor: '#0a0a0a'}}>
      <div className=" container">
        <div className=" grid items-center gap-10 grid-cols-1 lg:grid-cols-2">
          <div className=" w-full flex items-center justify-center">
            {/* <img  src="images/test.jpg" class="img-fluid rounded-3xl" /> */}
            <video
              className="rounded-3xl"
              src="/flower.webm"
              width="600"
              height="300"
              controls="controls"
              autoPlay={true}
            />
          </div>
          <div>
            <h1 className="text-4xl text-white w-full">How it works</h1>
            <h5 className="pt-2 text-base text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente,
              eligendi quod placeat impedit omnis corrupti quis illum, corporis
              tenetur aperiam doloremque quae sed quidem ipsa minima,
              accusantium minus eos fuga!
            </h5>
            <div className="mt-8 flex items-center gap-3">
              <Link to="/contact" className="px-8 py-2 rounded-3xl text-orange-400 hover:text-white  border-2 border-orange-500 hover:bg-orange-600">
               Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
