//variavel array que armazenas informações do carrinho
let cart = [];

//variavel armazena aquantidade de itens no modal
let modalQt = 1;

//variavel para identificar qual é o key do elemento selecionado
let modalKey = 0;


//criando uma função para reduzir o document.querySelector
const c = (el)=>{
    return document.querySelector(el);
}

const cs = (el)=>{
    return document.querySelectorAll(el);
}

//listagem das pizzas
pizzaJson.map( (item, index)=>{
    //clonando o modelo no corpo do html
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //preencher as informações em pizzaitem
    //selecionando a div respectiva e lançando o conteudo 

    //insere uma especie de marcação no item, para se rutilizado como referÊncia
    pizzaItem.setAttribute('data-key', index);//gerou um data-key para cada indice

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$  ${item.price.toFixed(2)}`;

    //adicionando um evento de click, para quando clicar na tag (a) não atualizar a página
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
            //prevent evita que atualize a página
            e.preventDefault();


            //aramzenar em uma variavel qual pizza o usuário clicou
            //para informar ao modal preciasamos pegar a informação do data key
            let key = e.target.closest('.pizza-item').getAttribute('data-key') ;
            //e precio sair da  tag (a) para buscar atravé sod comando closest
            //closest sgnifica, ache o elemento mas proximo que tenha ('classe, ou id definido aqui')
            //nesse caso é logo a div anteriro

            modalQt = 1; //para que sempre qua abrir o modal ja tenha a quantidade 1
            
            modalKey = key;

            //preencher o modal com as informações capturadas e armazenadas na variavel key
            c('.pizzaBig img').src = pizzaJson[key].img;
            c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            c('.pizzaInfo--actualPrice').innerHTML = `R$  ${pizzaJson[key].price.toFixed(2)}`;

            //para remover a class de objeto selecionado
            c('.pizzaInfo--size.selected').classList.remove('selected'); // ****************

             cs('.pizzaInfo--size').forEach( (size, sizeIndex)=>{
                    if(sizeIndex == 2){ //2 é referente a opção maior, grande
                            size.classList.add('selected');
                    }
                    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
             } );
            

             //quantidade de itens no modal
             c('.pizzaInfo--qt').innerHTML = modalQt;


            //abrindo modal
            //abrindo a div, window pizzaa area que atualmente esta com display none
            c('.pizzaWindowArea').style.opacity = 0;
            c('.pizzaWindowArea').style.display = 'flex';

            //criando uma animação para a div não abrir de uma vez só
            setTimeout( ()=>{                               // ************
                c('.pizzaWindowArea').style.opacity = 1;
            },200 );
            
    } );

    //lançando o conteudo clonado na div com a class pizza área
    c('.pizza-area').append(pizzaItem);    //**************** 
} );


//eventos do modal

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    
    setTimeout( ()=>{
        c('.pizzaWindowArea').style.display = 'none';  // *********
    },500 );
}

//botão de cancelar
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{  //******
    item.addEventListener('click', closeModal);
});

//botões de quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{  //****************
    if(modalQt > 1){
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
} );

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
} );

//seleção de tamanho
cs('.pizzaInfo--size').forEach( (size, sizeIndex)=>{
        size.addEventListener('click', (e)=>{
            c('.pizzaInfo--size.selected').classList.remove('selected');//remove a seleção da tag que estiver selecionada
            size.classList.add('selected'); //adiciona a classe na tag atual
        } );
 } );

 c('.pizzaInfo--addButton').addEventListener('click', ()=>{

    let size = parseInt( c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    //juntar no mesmo indice do array itens que sejam iguais, em tamanho e tipo
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //retorna se o identificador buscado no array foi encontrado
    let key = cart.findIndex( (item)=>{
        return item.identifier == identifier;

    } );
    
    if(key > -1){

        cart[key].qt += modalQt;

    } else cart.push({
            identifier,
            id:pizzaJson[modalKey].id,  //nome da pizza
            size,                 //tamanho
            qt:modalQt                  //quantidade
        });
    
    updateCart ();

    closeModal();

 });

 //para abrir o menu do carrinho
c('.menu-openner').addEventListener('click', ()=>{
   if(cart.length > 0){
    c('aside').style.left = '0';
   }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


 function updateCart (){

    //quando realizar qualquer informação no acrrinho ele vai ser atualizado, versão mobile
    c('.menu-openner span').innerHTML = cart.length;

     //a função vai fazer o carrinho aparecer ou não
     //caso o tamanho total do carrinho seja maior que zero é q tem algo no carrinho
    if (cart.length > 0){
        c('aside').classList.add('show');

        c('.cart').innerHTML = '';


        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart) {

            let pizzaItem = pizzaJson.find( (item)=>{
                return item.id == cart[i].id;
            } );
            
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            //clonando os itens para o carrinho
            

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                pizzaSizeName = 'G';
                    break;
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }   else {
                    cart.splice(i, 1);
                }

                updateCart();
            } );

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            } );


            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    }   else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
 }

 