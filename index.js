document.getElementById('btn-input').addEventListener('click', save);
document.getElementById('btn-list').addEventListener('click', function() {
  list(true)});
document.getElementById('btn-cancel').addEventListener('click', cancel);
document.getElementById('btn-filter').addEventListener('click', function() {
  list(false)});

const msg = document.querySelector('#msg');
let produtos = [];
let produto = {};
let id = 0;
let idSel = 0;
let newProduct = 1;
let updateList = false;

function save() {
  valor = parseFloat(document.querySelector('#value').value.replace(",", "."));
  nome = document.querySelector("#name").value.trim();
  descricao = document.querySelector("#description").value.trim();

  try {
    checkValues();
  } catch (errorMsg) {
    msg.textContent=errorMsg;
    return;
  } 

  try{
    if (newProduct===1){  // adding new product
//        document.querySelector('#ctn-details').style.display='none';
        id += 1;
        produto = {
            id: id,
            nome: nome,
            descricao: descricao,
            valor: valor,
            incluidoEm: Date.now()        
        };
        produtos.push(produto);
        msg.textContent = `Produto ${produto.nome} incluído com sucesso`;
    } else {
        let Id = 0;
        try{
          Id = search(produtos, idSel);   // idSel contem o id do produto selecionado
        } catch (error){
          msg.textContent=error;
          return;
        }

        produtos[Id].nome = nome;
        produtos[Id].descricao = descricao;
        produtos[Id].valor = valor;
  //      if (document.querySelector('#ctn-details').style.display==='block'){
  //        show(idSel);
   //     } 
        msg.textContent = `Produto ${produtos[Id].nome} alterado com sucesso`;
    }  
    list(false);    
    clearInputs();
  } catch (error){
    msg.textContent=error;
    return;
  }
}  

function checkValues(){
  if (isNaN(valor)){
    throw new Error(`Valor do produto inválido! (${valor})`);
  }
  if (valor<=0){
    throw new Error(`Valor do produto inválido! (${valor})`);
  }
  if (nome===''){
    throw new Error(`Nome do produto inválido!`);
  }
  if (descricao===''){
    throw new Error(`Descrição do produto inválido!`);
  }

  let i = 0;
  while (i < produtos.length){
    if (produtos[i].nome.toLowerCase()===nome.toLowerCase()){
      if (newProduct===1){
        throw new Error(`Já existe um produto cadastrado com este nome!`);
      } else if (produtos[i].id != idSel){
        throw new Error(`Já existe um produto cadastrado com este nome!`);
      }
      break;         
    };
    i += 1;
  }
}

function list(isUpdated){
  if (isUpdated){
    updateList = true;
  };
  if (updateList==false){
    if (document.querySelector('#ctn-table').style.display!='block'){
      return;
    };
  };  

  let numeroDeProdutos = -1;
  if (produtos.length===0){
    document.querySelector('#ctn-table').style.display = 'none';
    msg.innerHTML = `Nenhum produto cadastrado`;
  } else {
    let filtered = filterProd();

    const tbl = document.querySelector('#tbl-products');
    tbl.innerHTML = `<tr> 
                        <th id="th-prod">Produto</th> 
                        <th id="th-val">Valor</th>
                        <th>Editar</th>
                        <th>Apagar</th>
                    </tr>`
    for (let i =0; i < filtered.length; i++){                     
      tbl.innerHTML += `<tr> 
                          <td class="show-product" onclick="show(${filtered[i].id})">${filtered[i].nome}</td> 
                          <td>${filtered[i].valor.toFixed(2)}</td>
                          <td class="edit-icon" onclick="edit(${filtered[i].id})"><span class="material-icons">edit</span></td>
                          <td class="del-icon" onclick="deleteProd(${filtered[i].id})"><span class="material-icons">delete</span></td>
                        </tr>`
    }
    document.getElementById('th-prod').addEventListener('click', function() {
        sort('name')});
    document.getElementById('th-val').addEventListener('click', function() {
        sort('value')});
    document.querySelector('#ctn-table').style.display = 'block';
    if (numeroDeProdutos===0){
      cancel();
      msg.innerHTML = `Não foram encontrados produtos conforme chave de pesquisa!`;  
    } else if (numeroDeProdutos>0) {
      cancel();
      if (numeroDeProdutos>1){
        msg.innerHTML = `Foram encontrados ${numeroDeProdutos} produtos!`;
      } else {
        msg.innerHTML = `Foi encontrado ${numeroDeProdutos} produto!`;
      }
    }
  }  

  function filterProd(){
    const filtro = document.querySelector("#filter-word").value.trim();
    let filtered = [];
    if (filtro===''){
//      msg.innerHTML = `&nbsp`;
      filtered = produtos;
      document.querySelector("#btn-filter").style.color='#000';
      return filtered;
    }
  
    document.querySelector("#btn-filter").style.color='#008000';
    numeroDeProdutos = 0;
    filtered = produtos.filter(function(obj){ 
      if ((obj.nome.toLowerCase().includes(filtro.toLowerCase())) || (obj.descricao.toLowerCase().includes(filtro.toLowerCase()))) {
        numeroDeProdutos += 1;
        return true;
      } else {
        return false;
      }
    })
    return filtered;
  }
}

function edit(id){
  let Id = 0;
  try{
    Id = search(produtos, id);
  } catch (error){
    msg.textContent=error;
    return;
  }

  msg.innerHTML = `&nbsp`;
  newProduct = 0;
  idSel = id;
  document.querySelector("#btn-input").textContent='Salvar produto';
  document.querySelector('#value').value = produtos[Id].valor;
  document.querySelector('#name').value = produtos[Id].nome;
  document.querySelector('#description').value = produtos[Id].descricao;

  // if (document.querySelector('#ctn-details').style.display==='block'){
  //   show(idSel);
  // }  
}

function sort(type){
  if (type==='name'){
    sortbyName();
  }
  if (type==='value'){
    sortbyVal();
  }
  list(false);

  function sortbyName(){
    produtos.sort(function (a,b){
      if (a.nome>b.nome){
        return 1;
      } else if (a.nome<b.nome){
        return -1;
      } 
      return 0;   
    })
  }

  function sortbyVal(){
    produtos.sort(function (a,b){
      if (a.valor>b.valor){
        return 1;
      } else if (a.valor<b.valor){
        return -1;
      } 
      return 0;   
    })
  }
}


function deleteProd(id){
  let Id = 0;
  try{
    Id = search(produtos, id);
  } catch (error){
    msg.textContent=error;
    return;
  }

  produtos.splice(Id,1);
  cancel();
  list(false);
}

function search(arr, id){    // retorna o id do array arr
  for (let i = 0; i < arr.length; i++){
    if (arr[i].id === id){
      return i;
    }   
  };
  throw new Error(`Produto não encontrado! (${id})`);
}

function show(id){
  let Id = 0;
  try{
    Id = search(produtos, id);
  } catch (error){
    msg.textContent=error;
    return;
  }
  msg.innerHTML = `&nbsp`;
  displayMessage(Id);
}

function cancel(){
  clearInputs();
  msg.innerHTML=`&nbsp`;
}

function clearInputs(){
  newProduct = 1;
  document.querySelector('form').reset();
  document.querySelector("#btn-input").textContent='Incluir produto';
}

function displayMessage(Id) {
  showCover();
  const cover = document.querySelector('#cover-div');

  const panel = document.createElement('div');
  panel.setAttribute('id', 'ctn-details');
  cover.appendChild(panel);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'x';
  panel.appendChild(closeBtn);

  const table = document.createElement('table');
  table.setAttribute('id', 'tbl-details');
  panel.appendChild(table);

  const detail = document.querySelector('#tbl-details');
  const date = new Date(produtos[Id].incluidoEm);

    detail.innerHTML = `<tr> 
                        <th colspan="2">Informações do Produto</th> 
                      </tr>
                      <tr> 
                        <th>Id</th>
                        <td>${produtos[Id].id}</td> 
                      </tr>
                      <tr>  
                        <th>Nome</th>
                        <td>${produtos[Id].nome}</td> 
                      </tr>
                      <tr>  
                         <th>Descrição</th>
                         <td>${produtos[Id].descricao}</td>  
                      </tr>
                      <tr>  
                         <th>Valor</th>
                         <td>${produtos[Id].valor.toFixed(2)}</td>
                      </tr>
                      <tr>  
                        <th>Incluído Em</th>
                        <td>${date.toLocaleDateString()} - ${date.toLocaleTimeString()}</td>
                      </tr>`               
    
  closeBtn.onclick = function() {
    hideCover();
  };
}

function showCover() {
  let coverDiv = document.createElement('div');
  coverDiv.id = 'cover-div';
  // make the page unscrollable while the modal form is open
  document.body.style.overflowY = 'hidden';
  document.body.append(coverDiv);
}

function hideCover() {
  document.getElementById('cover-div').remove();
  document.body.style.overflowY = '';
}