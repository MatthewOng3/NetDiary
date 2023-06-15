import React from 'react'

/**
 * @description Upcoming features section of the homepage
 * @author Matt
 * @access public
 * @path /
 */
function Learn(){
  return (
    <section style={{background:"rgba(0,0,0,0.9)"}} className=" bg-gray-900 w-full py-20 flex items-center justify-center">
    <div className="container">
      <h1 className="text-white text-center ">
        Upcoming Features
      </h1>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16 ">
          <div className="rounded-2xl overflow-auto flex flex-col ">
            <div className="h-4/6">   
                <img className="w-full h-full object-cover" src="/images/Mobile.png" alt="" />
            </div>
            <div className="w-full h-1/2 px-3 py-4">
                <h1 className="text-2xl text-white font-bold">
                    Mobile App
                </h1>
                <p className='text-white font-light'  >
                    Creating a mobile app to allow users to access their net diary from their phone and easily save links
                    through apps like TikTok and Instagram and share them
                </p>
            </div>
          </div>

        <div className="rounded-2xl overflow-hidden flex flex-col" >
          <div style={{height: '60%'}}>   
            <img className="w-full h-full object-cover" src="/images/ai.jpg" alt="" />
          </div>
          <div className="w-full px-3 py-6 h-1/2">
            <h1 className="text-2xl text-white font-bold">
              Automatic saving through AI 
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Integrating ChatGpt to automatically categorise your new links when saving or insert them into existing
             categories, whether it be using chrome extensions or through social media apps
            </p>
          </div>
        </div>
        
        <div className="rounded-2xl overflow-hidden ">
          <img className="w-full" src="/images/Chrome.jpg" alt="" />
          <div className="w-full px-3 py-6 ">
            <h1 style={{ marginBottom: "0" }} className="text-2xl text-white font-bold">
              Chrome extension
            </h1>
            <p className='text-white font-light' style={{ marginBottom: "0" }}>
              {" "}
             Easily save favourite webpages within a few seconds through our upcoming chrome extension
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Learn