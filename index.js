document.getElementById('btn-input').addEventListener('click', Save);
document.getElementById('btn-list').addEventListener('click', List);
document.getElementById('btn-cancel').addEventListener('click', Cancel);
document.getElementById('btn-filter').addEventListener('click', List);

const msg = document.querySelector('#msg');
let produtos = [];
let produto = {};
let id = 0;
let idSel = 0;
let newProduct = 1;

function Save() {
  valor = parseFloat(document.querySelector('#value').value.replace(",", "."));
  nome = document.querySelector("#name").value.trim();
  descricao = document.querySelector("#description").value.trim();

  try {
    CheckValues();
  } catch (errorMsg) {
    msg.textContent=errorMsg;
    return;
  } 

  try{
    if (newProduct===1){  // adding new product
        document.querySelector('#ctn-details').style.display='none';
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
          Id = Search(produtos, idSel);   // idSel contem o id do produto selecionado
        } catch (error){
          msg.textContent=error;
          return;
        }

        produtos[Id].nome = nome;
        produtos[Id].descricao = descricao;
        produtos[Id].valor = valor;
        msg.textContent = `Produto ${produtos[Id].nome} alterado com sucesso`;
        if (document.querySelector('#ctn-details').style.display==='block'){
          Show(idSel);
        } 
    }
    List();    
  } catch (error){
    msg.textContent=error;
    return;
  }
}  

function CheckValues(){
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

function List(){
  let numeroDeProdutos = -1;
  if (produtos.length===0){
 //   document.querySelector('#ctn-table').style.display = 'none';
    msg.innerHTML = `Nenhum produto cadastrado`;
  } else {
    let filtered = Filter();

    const tbl = document.querySelector('#tbl-products');
    tbl.innerHTML = `<tr> 
                        <th id="th-prod">Produto</th> 
                        <th id="th-val">Valor</th>
                        <th>Editar</th>
                        <th>Apagar</th>
                    </tr>`
    for (let i =0; i < filtered.length; i++){                     
      tbl.innerHTML += `<tr> 
                          <td class="show-product" onclick="Show(${filtered[i].id})">${filtered[i].nome}</td> 
                          <td>${filtered[i].valor.toFixed(2)}</td>
                          <td class="edit-icon" onclick="Edit(${filtered[i].id})"><span class="material-icons">edit</span></td>
                          <td class="del-icon" onclick="Delete(${filtered[i].id})"><span class="material-icons">delete</span></td>
                        </tr>`
    }
    document.getElementById('th-prod').addEventListener('click', function() {
        Sort(0)});
    document.getElementById('th-val').addEventListener('click', function() {
        Sort(1)});
    document.querySelector('#ctn-table').style.display = 'block';
    if (numeroDeProdutos===0){
      Cancel();
      msg.innerHTML = `Não foram encontrados produtos conforme chave de pesquisa!`;  
    } else if (numeroDeProdutos>0) {
      Cancel();
      msg.innerHTML = `Foram encontrado(s) ${numeroDeProdutos} produto(s)!`;
    }
  }  

  function Filter(){
    const filtro = document.querySelector("#filter-word").value.trim();
    let filtered = [];
    if (filtro===''){
      msg.innerHTML = ``;
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

function Edit(id){
  let Id = 0;
  try{
    Id = Search(produtos, id);
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

  if (document.querySelector('#ctn-details').style.display==='block'){
    Show(idSel);
  }  
}

function Sort(type){
  if (type===0){
    SortbyName();
  }
  if (type===1){
    SortbyVal();
  }
  List();

  function SortbyName(){
    produtos.sort(function (a,b){
      if (a.nome>b.nome){
        return 1;
      } else if (a.nome<b.nome){
        return -1;
      } 
      return 0;   
    })
  }

  function SortbyVal(){
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


function Delete(id){
  let Id = 0;
  try{
    Id = Search(produtos, id);
  } catch (error){
    msg.textContent=error;
    return;
  }

  produtos.splice(Id,1);
  Cancel();
  List();
}

function Search(arr, id){    // retorna o id do array arr
  for (let i = 0; i < arr.length; i++){
    if (arr[i].id === id){
      return i;
    }   
  };
  throw new Error(`Produto não encontrado! (${id})`);
}

function Show(id){
  let Id = 0;
  try{
    Id = Search(produtos, id);
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
  
  document.querySelector('#ctn-details').style.display = 'block';
}

function Cancel(){
  newProduct = 1;
  msg.innerHTML = `&nbsp`;
  document.querySelector('#value').value='';
  document.querySelector("#name").value='';
  document.querySelector("#description").value='';
  document.querySelector("#btn-input").textContent='Incluir produto';
  document.querySelector('#ctn-details').style.display = 'none';
}
