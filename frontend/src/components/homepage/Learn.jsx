import React from 'react'

function Learn(){
  return (
    <section style={{background:"rgba(0,0,0,0.9)"}} className=" bg-gray-900 w-full py-20 flex items-center justify-center">
    <div className="container">
      <h1 className="text-white text-center ">
        Future features
      </h1>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16   ">
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/l1.png" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
             Mobile App
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Creating a mobile app to allow users to access their net diary from their phone and easily save links
             through apps like tiktok and instagram
            </p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/l1.png" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
             Faster saving through AI 
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Integrating ChatGpt to automatically categorise your new links when saving or insert them into existing
             categories
            </p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/l1.png" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
              Advanced Suggestions
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Suggestion functionality that can be toggled on or off for specific categories. These suggestions will 
             find links similar to the ones you have saved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Learn