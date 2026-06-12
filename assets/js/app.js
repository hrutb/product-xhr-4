 let BaseURL = 'https://fakestoreapi.com';   

 let product_url = `${BaseURL}/products`; 


const productForm = document.getElementById('productForm');
const productContainer = document.getElementById('productContainer');
const titleControl= document.getElementById('title');
const priceControl= document.getElementById('price');
const imgControl= document.getElementById('img');

const addProduct= document.getElementById('addProduct');
const updateProduct= document.getElementById('updateProduct');


let productArr = [];

function snackbar(msg,icon){ 
              swal.fire({ 
                 title:msg,
                 icon:icon,
                 timer:3000
              })
} 









 function fetchProduct(){  

    let xhr = new XMLHttpRequest() ;
        xhr.open('GET',product_url);

        xhr.send(null);

       xhr.onload= function(){ 
          if(xhr.status>=200 && xhr.status<=299){ 
                  productArr = JSON.parse(xhr.response);
                     createCard(productArr.reverse());
            
            }else{ 
               snackbar('error to fetch Api...!!', 'error');   
            }
       }

 }

 fetchProduct() ;


 function createCard(arr){ 
         let res = " "; 
         arr.forEach(ele=>{ 
               res +=`<div class="col-md-4 mb-4" id=${ele.id}>
                    <div class="card productCard">
                    <div class="card-header  bg-primary">
                        <h3>${ele.title}</h3>
                        <h4>${ele.price}$</h4>
                    </div>

                    <div class="card-body">
                           <img src="${ele.image}" alt="">
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button onclick="onEdit(this)"  class="btn btn-inline-block btn-outline-info" >Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                    </div>
                </div>
            </div>`   
         })
 productContainer.innerHTML =res;
}






function onSubmit(eve){ 
      eve.preventDefault();

      let newObj = { 
            title:titleControl.value ,
            price:priceControl.value ,
            image:imgControl.value 
      }

      productArr.push(newObj); 


      let xhr= new XMLHttpRequest() ; 
       xhr.open('POST', product_url);
       xhr.send(JSON.stringify(newObj));
       
       xhr.onload = function(){ 
         if(xhr.status>=200  && xhr.status<=299){ 
                let res  = JSON.parse(xhr.response) ;
                let div = document.createElement('div');
                    div.id=res.id; 
                   div.className= 'col-md-4 mb-4';
                   div.innerHTML =`<div class="card productCard">
                                       <div class="card-header  bg-primary">
                                             <h3>${newObj.title}</h3>
                                             <h4>${newObj.price}$</h4>
                                       </div>

                                       <div class="card-body">
                                                <img src="${newObj.image}" alt="">
                                       </div>
                                       <div class="card-footer d-flex justify-content-between align-items-center">
                                             <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info" >Edit</button>
                                             <button onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger">Delete</button>
                                       </div>
                                    </div>` 
             productContainer.prepend(div);
             productForm.reset();

         } else{ 
             snackbar('failed to submit Product', 'error')
             }
         
       }
    

} 




function onEdit(ele){
          let  editId= ele.closest('.col-md-4').id; 
              localStorage.setItem('EditId',editId);
         let editUrl= `${BaseURL}/products/${editId}`;

         let xhr = new XMLHttpRequest(); 

            xhr.open('GET', editUrl); 
            xhr.send(null);
            xhr.onload = function(){ 
               if(xhr.status>=200  && xhr.status<=299){ 
                   let editObj = JSON.parse(xhr.response);
                   
                     titleControl.value = editObj.title ;
                     priceControl.value = editObj.price ;
                     imgControl.value = editObj.image;
                      
                  addProduct.classList.add('d-none'); 
                  updateProduct.classList.remove('d-none');
                  document.querySelectorAll('.btn-outline-danger').forEach((btn)=>{ 
                        btn.disabled=true; 
                  })


                 }

            }
         
         
         
         
         }




function onUpdate(){ 
       let updateId= localStorage.getItem('EditId');
       let updateUrl = `${BaseURL}/products/${updateId}`;

       let updateObj ={ 
            title:titleControl.value,
            price:priceControl.value,
            image:imgControl.value

       } ;

     let xhr= new XMLHttpRequest() ;
          xhr.open('PATCH', updateUrl);
          xhr.send(JSON.stringify(updateObj));

          xhr.onload = function (){ 
              if(xhr.status>=200  && xhr.status<=299){ 
                let div = document.getElementById(updateId);
                   div.innerHTML= `<div class="card productCard">
                                       <div class="card-header  bg-primary">
                                             <h3>${updateObj.title}</h3>
                                             <h4>${updateObj.price}$</h4>
                                       </div>

                                       <div class="card-body">
                                                <img src="${updateObj.image}" alt="">
                                       </div>
                                       <div class="card-footer d-flex justify-content-between align-items-center">
                                             <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info" >Edit</button>
                                             <button onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger">Delete</button>
                                       </div>`

                    addProduct.classList.remove('d-none'); 
                    updateProduct.classList.add('d-none');
                    productForm.reset();
                  document.querySelectorAll('.btn-outline-danger').forEach((btn)=>{ 
                        btn.disabled= false;

                  })
              }else{ 
                 snackbar('update product failed', 'error')
              }
          }
 
}















productForm.addEventListener('submit', onSubmit); 
updateProduct.addEventListener('click', onUpdate);