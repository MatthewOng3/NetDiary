import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import ListEntry from "../components/ListEntry";
import api from "../util/api";
import { Colors } from "../constants/Colors";
import '../styles/CategoryComponent.css'

/**
 * @description Shared page component that users you share webpages to will visit and receive
 * @author Matt
 */
function SharedPage() {
  const [listEntries, setListEntries] = useState([]) //State for webpage entries
  const [categoryName, setCategoryName] = useState("") //State for category name
  const [isLoading, setIsLoading] = useState(false)
  const { collectionId, catId } = useParams()

  //When component loads send request to backend to retrieve relevant data
  useEffect(() => {
    setIsLoading(true)
    const shareToken = localStorage.getItem("share-token")
    const url = `categories/shareCategory/${shareToken}/${collectionId}/${catId}`

    api.get(url).then((res) => {
      const categoryObj = res.data.categoryObj
      setListEntries(categoryObj.listEntries)
      setCategoryName(categoryObj.name)
      setIsLoading(false)
    })
      .catch(err => console.log(err)).finally(() => setIsLoading(false))
  }, [])

  return (
    <div style={{ backgroundColor: Colors.dark_grey200, width: '100%', height: '100vh', overflow: 'hidden', scrollBehavior: 'smooth', paddingBottom: '2%' }} >
      <div style={{ backgroundColor: Colors.dark_grey200, display: 'flex', justifyContent: 'center', minHeight: '100%', alignItems: 'center' }}>
        {isLoading && <LoadingSpinner />}
        <div className="card" style={{ height: '100%', boxShadow: '2px 2px #1c1c20', boxSizing: 'border-box', borderWidth: '0', borderRadius: '9px', width: '25%' }} >
          <div className="card-header " style={{ backgroundColor: '#2c2c31', width: '100%', borderBottom: 'none', }}>
            <div style={{ width: '60%' }} className="flex-1 justify-center items-center flex">
              <p style={{ color: 'white', fontSize: '19px' }}>{categoryName}</p>
            </div>
          </div>
          <div className='scroll-container'>
            <div className="card-body scrollbar" id='scrollbar1'>
              {

                listEntries.map((value, index) => {
                  return (
                    <ListEntry key={value.entryId} text_description={value.name} link={value.link} allowEdit={false} canAddCluster={false} entryId={value.entryId} catId={catId} sharedCat={true} />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedPage;