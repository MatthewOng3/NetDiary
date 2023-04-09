import React from 'react'

function Learn(){
  return (
    <section style={{background:"rgba(0,0,0,0.9)"}} className=" bg-gray-900 w-full py-20 flex items-center justify-center">
    <div className="container">
      <h1 className="text-white text-center ">
        Learn More About Us
      </h1>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16   ">
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/l1.png" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
             Our Goal
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Create a central hub of your internet and revolutionise how people save their bookmarks
            </p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/l1.png" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
             Who we are
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, ratione.
            </p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/l1.png" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
              What We do
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, ratione.
            </p>
          </div>
        </div>

 
      </div>
    </div>
  </section>
  )
}

export default Learn