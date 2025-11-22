
let  addbutton = document.getElementById("add-btn");

let partie_input=document.getElementById("partie-content");
 
let list_item = document.getElementById("list-items");


addbutton.addEventListener("click",()=>{
var partie_content=partie_input.value;
console.log(partie_content)

additem();


})

//add elmenet to list 
function addItemToListUi(item,id,completed)
{
  
  const newDiv = document.createElement("div");
  newDiv.className ="item"
  const item_check = document.createElement("div");

  var input = document.createElement("input");
  input.setAttribute('type', 'checkbox');
  if(completed==true)
   { input.disabled = true
    input.checked =true
   }

  //assisiate id to the input 
var  listofpaties = document.getElementsByClassName("item")
var itemCount = listofpaties.length+1
newDiv.id = id;
parentid= id;
const deleteIcon = document.createElement("i");
deleteIcon.className = "fa fa-times"; 
deleteIcon.style.color = "red";
   deleteIcon.style.cursor = "pointer";

deleteIcon.style.marginLeft = "10px";


deleteIcon.onclick = () => deleteItem(newDiv.id);


//const deleteBtn = document.createElement("button");

//deleteBtn.innerHTML = "delete"; 
//deleteBtn.onclick =  function() {
 //   deleteItem(id); 
//};
  



 var label= document.createElement("label")
 label.textContent = item

   item_check.appendChild(input)
   item_check.appendChild(label)
  newDiv.appendChild(item_check)
      newDiv.appendChild(deleteIcon)



newDiv.addEventListener("click",(event)=>{
    markCompleateUi(event.target,newDiv.id)
})

list_item.appendChild(newDiv)

}
//delte api call 
async function deleteApiCall(id)
{

res = await fetch("/items/"+id ,{method : "DELETE"} );
result = await res.json()
if(result.sucess)
{
  console.log("deleted b  ")
  populateList()
}
  populateList()

}


//delete element 
function deleteItem(id)
{
console.log(id)
deleteApiCall(id)

}

function markCompleateUi(target,id)
{
updateState(id)

}

async function updateState(id)
{
var res = await  fetch("/items/"+id ,{method:"PUT"});
res= await res.json()
if(res.sucess)
{
  populateList();
}



}




async function getItems()
{
   try
   {
    var res = await fetch("/items")
    var data = await res.json()
    return data

   }catch(err){
    console.log(err)

   }
}
async function additem()
{
  let partie_input=document.getElementById("partie-content");
  var nameV = partie_input.value
if(nameV.trim().length <= 0  ){

    console.log("empty filrd")
    return 
  }
  res = await fetch("/items",{method : "POST",headers : {"Content-Type":"application/json"},
  body : JSON.stringify({name :nameV})
  })
  res = await res.json()
  if(res.success)
  {

    populateList()
  }

}




async function populateList()
{list_item.innerHTML = "";
var items = await  getItems();
console.log("from the populate function "+items)
if(items.length!=0)
{

list_item.innerHTML = "";
var count =0
items.forEach(element => {
  console.log("Item:", element.name, element.completed,element.id);
  if(!element.completed)
  {
    count ++
  }
  document.getElementById("counter").innerText = count
addItemToListUi(element.name,element.id,element.completed)


});

}
else
{
    document.getElementById("counter").innerText = 0

}

}





populateList()

const ws = new WebSocket("ws://127.0.0.1:3000");

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "added" || msg.type === "deleted" || msg.type === "updated") {
        populateList(); 
    }
};