import React, { useState, useEffect } from 'react'
import './index.css'
import Modal from 'react-awesome-modal'
// import api from './api/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import Card from './component/loader'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import * as  Yup from 'yup'
import 'fontawesome-4.7'

type Todo = {
  id: string,
  name: string,
  email: string
}

type Todos = {
  Data: Array<Todo>
}

const Home: React.FC<Todos> = () => {



  const [Data, setData] = useState([])
  const [modal, setmodal] = useState(false)
  const [Onlion, setOnlion] = useState(false)
  const [edit, setedit] = useState(false)
  const [Loader, setLoader] = useState(true)
  const [data, setdata] = useState({ id : "" , name: "", email: "" })
  const [del, setdel] = useState({ del: false, data: "" })

  useEffect(() => {
    fetch('/.netlify/functions/get').then(response => {
      return response.json()
    })
       .then(data => {
            setData(data)
          });
  

    setTimeout(() => {
      setLoader(false)

    }, 3000);

    return () => {
      setOnlion(false)

    }


  }, [Onlion ? Data : null])


  const deletTask = () => {
    fetch('/.netlify/functions/delete', {
      method: 'POST',
      body: JSON.stringify({ id : del.data}),
    }).then(response => {
      return response.json()
    })
    setTimeout(() => {
      setdel({ del: false, data: "" })
      setOnlion(true)
      
    }, 1000);
    setLoader(true)
    // setOnlion(false)
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setdata(prevState => ({
      ...prevState,
      [name]: value
    }));
  };





  return (
    <div>
      <div className="container-xl">
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-6">
                  <h2>Serverless <b>JamStack Crud</b></h2>
                </div>
                <div className="col-sm-6">
                  <button className="btn btn-success edit" onClick={() => setmodal(true)} ><i className="material-icons"></i> <span>Add New</span></button>
                  <button className="btn btn-danger delete" ><i className="material-icons"></i> <span>Delete</span></button>
                </div>
              </div>
            </div>

            {Loader ? <Card />
              :
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>
                      <span className="custom-checkbox">
                        <input type="checkbox" id="selectAll" />
                        <label htmlFor="selectAll" />
                      </span>
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>



                  {Data.length > 0 ? Data.map((item, index: number) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="checkbox1" name="options[]" defaultValue={1} />
                            <label htmlFor="checkbox1" />
                          </span>
                        </td>
                        <td>{item.data.name}</td>
                        <td>{item.data.email}</td>
                        
                        <td>
                          <i className="fa fa-edit" onClick={() => { setedit(true); setdata({name : item.data.name , email : item.data.email , id : item.ref["@ref"].id}) }}></i>
                          <i className="fa fa-trash" onClick={() => setdel({ del: true, data: item.ref["@ref"].id })}></i>
                        </td>
                      </tr>
                    )
                  })
                    : null
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>

      <div className="model">
        <Modal visible={modal} width="400" height="400" effect="fadeInUp" >
          <Formik
            initialValues={{ name: "", email: "" }}
            validationSchema={
              Yup.object().shape({
                name: Yup.string().max(10, "Above 10 charctor required").required("Name field is required"),
                email: Yup.string().email().required("Email is required"),


              })
            }
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              fetch('/.netlify/functions/add', {
                body: JSON.stringify(values),
                method: 'POST'
            }).then(response => {
                return response.json()
            })
              setTimeout(() => {
                setmodal(false)
                setOnlion(true)
                setLoader(true)
                values.name = "",
                  values.email = ""
              }, 1000);
              // setOnlion(false)
            }}
          >

            {({

              setSubmitting, errors , touched
              /* and other goodies */
            }) => (

                <Form>
                  <div className="modal-header">
                    <h4 className="modal-title">Add Employee</h4>
                    <button type="button" className="close" onClick={() => setmodal(false)} >×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <Field type="text" className={'form-control' + (errors.name && touched.email ? ' is-invalid' : '')} id="name" name="name" />
                      <ErrorMessage  name="name" component="div" className="invalid-feedback" />

                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field type="email" className={'form-control' + (errors.name && touched.email ? ' is-invalid' : '')} id="email"  name="email" />
                      <ErrorMessage  name="email" component="div" className="invalid-feedback" />
                    </div>

                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={() => setmodal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success">Add</button>
                  </div>
                </Form>
              )}

          </Formik>


        </Modal>
      </div>

      <div className="model edit">
        <Modal visible={edit} width="400" height="400" effect="fadeInUp" >
          <Formik
            initialValues={{ name: data.name, email: data.email }}
            validationSchema={
              Yup.object().shape({
                name: Yup.string().max(10, "Above 10 charctor required"),
                email: Yup.string().email()


              })
            }
            onSubmit={(values) => {

              let VluesData ={
                  id : data.id ,
                  name : data.name,
                  email : data.email
              }
              fetch(`/.netlify/functions/update`, {
                body: JSON.stringify(VluesData),
                method: 'POST'
              }).then(response => {
                return response.json()
              })
              setOnlion(true)
              setLoader(true)
              setTimeout(() => {
                data.id = ""
                data.name = ""
                data.email = ""

              }, 2000);
              
            }}
          >

            {({
               errors, touched }) => (

                <Form>
                  <div className="modal-header">
                    <h4 className="modal-title">Edit Employee</h4>
                    <button type="button" className="close" onClick={() => setedit(false)} >×</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="fname">Name</label>
                      <Field type="text" value={data.name}
                        className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')}
                        onChange={handleChange}
                        id="fname" name="name" />
                      <ErrorMessage name="name" component="div" className="invalid-feedback" />

                    </div>
                    <div className="form-group">
                      <label htmlFor="femail">Email</label>
                      <Field type="email" value={data.email} onChange={handleChange} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} id="femail" name="email" />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>

                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={() => setedit(false)}>Cancel</button>
                    <button type="submit" onClick={()=> setedit(false)} className="btn btn-success">Update</button>
                  
                  </div>
                </Form>
              )}

          </Formik>


        </Modal>
      </div>

      <div>
        <Modal visible={del.del} width="400" height="400" effect="fadeInUp" >
          <div className="modal-header">
            <h4 className="modal-title">Delete Employee</h4>
            <button type="button" className="close" onClick={() => setdel({ del: false, data: "" })} >×</button>
          </div>
          <div className="modal-body">
            <label htmlFor="dname">Are You Sure !</label>

            <label htmlFor="demail">You want yo Delete it!</label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" >Cancel</button>
            <button type="button" className="btn btn-danger" onClick={deletTask}>Delete</button>
          </div>


        </Modal>
      </div>

    </div>
  )
}
export default Home
