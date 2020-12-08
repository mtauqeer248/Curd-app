import React,{useEffect , useState} from 'react'
import Skeleton from "react-loading-skeleton";


const  Card = () =>  {

  const [Data, setData] = useState([])

    useEffect(() => {
        fetch('/.netlify/functions/get').then(response => {
            return response.json()
        })
       .then(data => {
             setData(data)
           });
        })
    return (
        <div>
 <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <span className="custom-checkbox">
                      {/* <label htmlFor="selectAll" /> */}
                      <input type="checkbox" id="selectAll" />
                    </span>
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

           
            
              
              


                    {Array(Data.length)
                        .fill()
                        .map((index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <span className="custom-checkbox">
                                            
                                            <Skeleton circle={true} height={30} width={30} /> 
                                        </span>
                                    </td>
                                    <td><Skeleton height={30}/></td>
                                    <td><Skeleton height={30}/></td>
                                    <td>
                                    <Skeleton height={20}/>
                                    <Skeleton height={20}/>
                                    </td>
                                </tr>
                            )
                        })}
                           </tbody>
                           </table>

         
        </div>
    )
}

export default Card
