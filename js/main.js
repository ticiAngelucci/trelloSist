
/* Variablñes */
const e_mainContainer = document.getElementById('main-container');
const e_cardsContainer = document.getElementById('cards-container');

const e_sidebar = document.getElementById('sidebar');
const e_sidebarButton = document.getElementById('sidebar-button');
const e_sidebarClose = document.getElementById('sidebar-close');

const e_addCardText = document.getElementById('add-card-text');
const e_addCardButton = document.getElementById('add-card-button');

const e_boardsList = document.getElementById('boards-list');
const e_addBoardText = document.getElementById('add-board-text');
const e_addBoardButton = document.getElementById('add-board-button');

const e_saveButton = document.getElementById('save-button');
const e_deleteButton = document.getElementById('delete-button');

const e_cardContextMenu = document.getElementById('card-context-menu');
const e_cardContextMenuDelete = document.getElementById('card-context-menu-delete');
const e_cardContextMenuClear = document.getElementById('card-context-menu-clear');
const e_cardContextMenuDuplicate = document.getElementById('card-context-menu-duplicate');

const e_alerts = document.getElementById('alerts');

const e_title = document.getElementById('title');
//Aca pasamos a "agarrar" osea llamamos elementos del html con su respectivo id..
//tambien se puede hacer con class pero nosotros lo hacemos con id

// Auto save enabled as default
let autoSaveInternalId = setInterval(function (){
    saveData();
}, 5000);
//En esta funcion estariamos seteando un intervalo de 5000(5 segundos)
//en el cual cada 5seg va a ejecutar la funcion de guardar datos

var appData = {
    'boards': [],
    'settings': {
        'userName': "User",
        'dataPersistence': true
    },
    'currentBoard': 0,  // The index of the currently open board.
    'identifier': 0
};
//Aca creamos un arreglo donde vamos guardando informacion de la app 


/* Extensiones o metodos donde tocamos el array */
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
//Esta extension permite mover un elemento de una matriz a una posición específica en la misma matriz. 
//Los argumentos *from* y *to* representan los índices de los elementos que deseas mover. 
//this.splice(from, 1)[0]: 
//1)Esto elimina el elemento en la posición *from* de la matriz original y retorna ese elemento. 
//2)El [0] al final se utiliza para acceder al primer (y en este caso, único) elemento del array resultante de splice.
//3)Luego, this.splice(to, 0, ...) inserta el elemento previamente eliminado en la posición *to* sin eliminar ningún 
//elemento en esa posición. Asique el elemento se ha movido de la posición *from* a la posición *to* en la matriz.

Array.prototype.insert = function(index, item) {
    this.splice( index, 0, item );
};
//Esta extension permite insertar un elemento en una posición específica de la matriz. 
//Los argumentos *index* e *item* representan el índice en el que queres insertar el elemento y el elemento que queres insertar. 
//1)this.splice(index, 0, item) inserta item en la posición index de la matriz sin eliminar ningún elemento en esa posición.

/* Funciones */
function currentCards() {
    return appData.boards[appData.currentBoard].cards;
}
//funcion donde  obtenemos las tarjetas del tablero actual

function currentBoard() {
    return appData.boards[appData.currentBoard];
}
//lo mismo q la funcion de arriba solo q con tableros:)

function uniqueID() {
    appData.identifier += 1;
    return 'b' + appData.identifier;
}
//funcion q usamos para generar id únicos para tableros o elementos sumamos un +1 a appData.identifier en 1 
//y tenemos un id que comienza con la letra 'b' + el +1 anterior

function getMouseOverCard() {
    return document.querySelectorAll('.parent-card:hover')[0];
}
//funcion q intenta encontrar la card sobre la cual el cursor del mouse se encuentra en ese momento(lo pasamos como parametro con el querySelectorAll).
// devuelve el primer elemento encontrado

function getMouseOverItem() {
    return document.querySelectorAll('.parent-card > ul > li:hover')[0];
}
//funcion q intenta encontrar la tarea sobre la cual el cursor del mouse se encuentra en ese momento(lo pasamos como parametro con el querySelectorAll).
// .parent-card > ul > li:hover para buscar elementos que sean elementos de lista (<li>) que estén dentro de elementos con clase parent-card.
// devuelve el primer elemento encontrado

function getItemFromElement(element) {

    for (let _card of currentCards()) {
        for (let _item of _card.items) {
            if (_item.id === element.id) {
                return _item;
            }
        }
    }
}
// funcion toma un elemento HTML como argumento y busca un objeto que corresponda a ese elemento en la estructura de datos de la aplicación. 
//Busca el elemento en las tarjetas y tareas existentes y retorna el objeto que coincide con el id del elemento.

function getCardFromElement(element) {

    return currentCards().find(e => e.id === element.id);
}
// similar a la funcion de arriba, pero esta vez busca un objeto de tarjeta a partir de un elemento HTML de tarjeta.

function getBoardFromId(id) {
    

    return appData.boards.find(_b => _b.id === id);
}
//funcion q busca un objeto de tablero a partir de su id en la estructura de datos de la aplicación.

function listBoards() {

    e_boardsList.innerHTML = '';
    for (let _board of appData.boards) {
        let _boardTitle = document.createElement('li');
        _boardTitle.innerText = _board.name;
        _boardTitle.id = _board.id;
        if (_board.id === currentBoard().id) _boardTitle.classList.add('is-active');
        _boardTitle.addEventListener('click', () => {
            renderBoard(_board);
            listBoards();
        });
        e_boardsList.appendChild(_boardTitle);
    }
}
//funcion se utiliza para mostrar una lista de todos los tableros en la barra lateral. 
//limpia el contenido del elemento e_boardsList y luego recorre la lista de tableros en appData.boards, crea elementos de lista (<li>) 
//para cada tablero, asigna clases y eventos, y los agrega al elemento e_boardsList.

function renderBoard(board) {
    appData.currentBoard = appData.boards.indexOf(board);
    document.title = 'MyNote® | ' + currentBoard().name;
    e_title.innerText = currentBoard().name;
    renderAllCards();
}
//funcion q cambia el tablero actual en la aplicación al tablero especificado y actualiza la interfaz de usuario para reflejar el nuevo tablero. 
//También establece el título del documento en función del nombre del tablero.

function renderAllCards() {
   //refresh
    for (let _card of e_cardsContainer.querySelectorAll('.parent-card')) {
      //elimina carta
        _card.remove();
    }

    for (let _card of currentCards()) {
        // Vuelve a generar la card.
        let _generated = _card.generateElement();
        // Inserta este nuevo elemento de tarjeta en el e_cardsContainer justo antes del último hijo del contenedor. 
        //Esto asegura que las tarjetas se coloquen  en el orden adecuado.
        e_cardsContainer.insertBefore(_generated, e_cardsContainer.childNodes[e_cardsContainer.childNodes.length - 2]);
        //Actauliza
        _card.update();
    }
}
//Esta función actualiza el contenedor de tarjetas eliminando todas las tarjetas existentes 
//y luego generando y agregando de nuevo todas las tarjetas del tablero actual.

function renderCard(cardID) {
    let _card = currentCards().find(e => e.id === cardID);

    if (!_card) {
        // si no existe lo eliminamos
        let _currentCardElement = document.getElementById(cardID);
        _currentCardElement.parentNode.removeChild(_currentCardElement);
        return;
    }

    // se genera.
    let _currentCardElement = document.getElementById(_card.id);
    if (_currentCardElement != null) {
        let _generated = _card.generateElement();
        // reemplaza la carta del container.
        _currentCardElement.parentNode.replaceChild(_generated, _currentCardElement);
    } else {
        let _generated = _card.generateElement();
        // y la pone en orden.
        e_cardsContainer.insertBefore(_generated, e_cardsContainer.childNodes[e_cardsContainer.childNodes.length - 2]);
    }

    // actualiza
    _card.update();
}
//funcion q actualiza una tarjeta específica en la interfaz respecto su identificador. 
//Si la tarjeta ya no existe en los datos, se elimina de la interfaz de usuario. Si existe, se genera y reemplaza en el contenedor de tarjetas.

function toggleHoverStyle(show) {

    if (show) {

        //creamos un nuevo style
        let _hoverStyle = document.createElement('style');
        _hoverStyle.id = "dragHover";

        _hoverStyle.innerHTML = ".parent-card:hover {background-color: #c7cbd1;}.parent-card > ul > li:hover {background-color: #d1d1d1;}";
        document.body.appendChild(_hoverStyle);
    } else {

        let _hoverStyle = document.getElementById('dragHover');
        _hoverStyle.parentNode.removeChild(_hoverStyle);
    }
}
//funcion q permite habilitar o deshabilitar un estilo de resaltado cuando el cursor del mouse pasa sobre tarjetas y tareas.
// Agrega o elimina dinámicamente un estilo CSS para que los elementos se vean más oscuros cuando se pasa el mouse sobre ellos.

function addBoard() {

    let _boardTitle = e_addBoardText.value;
    if (!_boardTitle) return createAlert("Escribe un nombre para el escritorio!");  // No creamos si no tiene nombre
    if (appData.boards.length >= 512) return createAlert("Limite de escritorios excedido")  // Si supera el numero 512 de tablas
    e_addBoardText.value = '';

    let _newBoard = new Board(_boardTitle, uniqueID(), {'theme': null});
    appData.boards.push(_newBoard);
    listBoards();
}
//funcion q agrega un nuevo tablero a la aplicación en función del titulo proporcionado en el value en la barra lateral.
// Verifica si el nombre no está vacío y si no se ha alcanzado el límite de tableros , y 
//luego crea un nuevo tablero, lo agrega a appData.boards y actualiza la lista de tableros en la interfaz de usuario.

/* Clases */
class Item {

    constructor(title, description=null, id, parentCardId) {
        this.title = title;
        this.description = description;  
        this.id = id;
        this.isDone = false;
        this.parentCardId = parentCardId;
    }

    getParentCard() {
        return document.getElementById(this.parentCardId);
    }

    check(chk=true) {
        this.isDone = chk;
        if (chk) {
            document.getElementById(this.id).style.textDecoration = 'line-through';
        } else {

            document.getElementById(this.id).style.textDecoration = 'none';
        }
    }

    update() {
        let _element = document.getElementById(this.id);

        _element.getElementsByTagName('p')[0].addEventListener('click', () => {
            if (this.isDone) {
                this.check(false);
            } else {
                this.check(true);
            }
        });

        _element.addEventListener('mousedown', cardDrag_startDragging, false);
        this.check(this.isDone);
    }
}
//Esta clase la usamos para representar elementos individuales (tareas) que se pueden agregar a una tarjeta en un tablero.
//funcion check(chk=true) se utiliza para marcar o desmarcar la tarea como completada. También aplica un estilo de tachado al 
//texto de la tarea cuando se marca como completada.
//funcion update() agrega escuchas de eventos, como hacer clic en una tarea para marcarla como completada o deshacer la marca.

class Card {

    constructor(name, id, parentBoardId) {
        this.name = name;
        this.items = [];
        this.id = id;
        this.parentBoardId = parentBoardId;
    }

    addItem(item) {
        this.items.push(item);
        renderCard(this.id);
    }

    removeItem(item) {
        this.items = this.items.filter(val => val !== item);
        renderCard(this.id);
    }

    update() {
        for (let _item of this.items) {
            _item.update();
        }
    }

    renderItems() {
        let _newItemList = document.createElement('ul');
        _newItemList.id = this.id + '-ul';
        for (let _item of this.items) {
            let _newItem = document.createElement('li');
            _newItem.id = _item.id;
            
            // titulo
            let _newItemTitle = document.createElement('p');
            _newItemTitle.innerText = _item.title;
            _newItemTitle.classList.add('item-title', 'text-fix', 'unselectable');
            
            let _newItemButtons = document.createElement('span');

            // Editar boton 
            let _newItemEditButton = document.createElement('i');
            _newItemEditButton.ariaHidden = true;
            _newItemEditButton.classList.add('fa', 'fa-pencil');
            _newItemEditButton.addEventListener('click', () => {
                
                // editar contenido de tarjeta
                let _input = document.createElement('textarea');
                _input.value = _newItemTitle.textContent;
                _input.classList.add('item-title');
                _input.maxLength = 256;
                _newItemTitle.replaceWith(_input);

                let _save = () => {
                    _item.title = _input.value;
                    renderCard(this.id);
                };

                _input.addEventListener('blur', _save, {
                    once: true,
                });
                _input.focus();
            });

            // borrar boton
            let _newItemDeleteButton = document.createElement('i');
            _newItemDeleteButton.ariaHidden = true;
            _newItemDeleteButton.classList.add('fa', 'fa-trash');
            _newItemDeleteButton.addEventListener('click', () => {
                createConfirmDialog("Quieres borrar esta tarea?", () => this.removeItem(_item));
            });

            // añadir botones
            _newItemButtons.appendChild(_newItemEditButton);
            _newItemButtons.appendChild(_newItemDeleteButton);

            // añadir
            _newItem.appendChild(_newItemTitle);
            _newItem.appendChild(_newItemButtons);
            _newItemList.appendChild(_newItem);
        }

        return _newItemList;
    }

    generateElement() {

        let _newCardHeader = document.createElement('span');
        let _newCardHeaderTitle = document.createElement('h2');
        _newCardHeaderTitle.id = this.id + '-h2';
        _newCardHeaderTitle.innerText = this.name;
        _newCardHeaderTitle.classList.add('text-fix', 'card-title');

        _newCardHeaderTitle.addEventListener('click', (e) => {
            let _input = document.createElement('input');
            _input.value = _newCardHeaderTitle.textContent;
            _input.classList.add('card-title');
            _input.maxLength = 128;
            _newCardHeaderTitle.replaceWith(_input);

            let _save = () => {
                this.name = _input.value;
                renderCard(this.id);
            };

            _input.addEventListener('blur', _save, {
                once: true,
            });
            _input.focus();
        });

    
        let _newCardHeaderMenu = document.createElement('i');
        _newCardHeaderMenu.ariaHidden = true;
        _newCardHeaderMenu.classList.add("fa", "fa-bars");
        _newCardHeader.append(_newCardHeaderTitle);
        _newCardHeader.append(_newCardHeaderMenu);
        _newCardHeaderMenu.addEventListener('click', cardContextMenu_show);

        let _newInput = document.createElement('input');
        _newInput.id = this.id + '-input';
        _newInput.maxLength = 256;
        _newInput.type = 'text';
        _newInput.name = "add-todo-text";
        _newInput.placeholder = "Añadir tarea...";
        _newInput.addEventListener('keyup', (e) => {
            if (e.code === "Enter") _newButton.click();
        });

        
        let _newButton = document.createElement('button');
        _newButton.id = this.id + '-button';
        _newButton.classList.add("plus-button");
        _newButton.innerText = '+';
        _newButton.addEventListener('click', () => {
            let _inputValue = _newInput.value;
            if (!_inputValue) return createAlert("Escribe algo antes de guardar!");
            let _item = new Item(_inputValue, null, getBoardFromId(this.parentBoardId).uniqueID(), this.id);
            this.addItem(_item);
            _newInput.value = '';
            _newInput.focus(); 
        });

        let _newCard = document.createElement('div');
        _newCard.id = this.id;
        _newCard.classList.add('parent-card');
        _newCard.appendChild(_newCardHeader);

        if (this.items) {
            
            // si tiene items renderiza
            let _newItemList = this.renderItems();

            //añade a lista
            _newCard.appendChild(_newItemList);
        }

        // añade botones.
        _newCard.appendChild(_newInput);
        _newCard.appendChild(_newButton);

        return _newCard;
    }
}
//Esta clase la usamos para representar tarjetas (o listas) que contienen tareas.
//Card tiene métodos para agregar y eliminar tareas (addItem y removeItem) y para actualizar las tareas y la interfaz de usuario (update y renderItems).
//La función generateElement() crea un elemento HTML que representa la tarjeta, incluyendo su nombre, tareas, 
//y botones para editar y eliminar elementos. También proporciona funcionalidad para editar el nombre de la tarjeta haciendo clic en él.

class Board {

    constructor(name, id, settings, identifier=0) {
        this.name = name;
        this.id = id;
        this.settings = settings;
        this.cards = [];  
        this.identifier = identifier === null ? Date.now() : identifier;  
    }

    uniqueID() {
        this.identifier += 1;
        return 'e' + this.identifier.toString();
    }

    addCard() {
        let _cardTitle = e_addCardText.value;
        e_addCardText.value = '';
    
        // si no ingresa titulo se pone "Tabla sin titulo *numero q pertenece*"
        if (!_cardTitle) _cardTitle = `Tabla sin titulo ${this.cards.length + 1}`;
    
        let _card = new Card(_cardTitle, this.uniqueID(), this.id);
        this.cards.push(_card);

        let _newCard = _card.generateElement();
        e_cardsContainer.insertBefore(_newCard, e_cardsContainer.childNodes[e_cardsContainer.childNodes.length - 2]);
    }
}
//Esta clase la usamos para representar tableros que contienen tarjetas.
//Board tiene métodos para agregar tarjetas (addCard) y para generar identificadores únicos para elementos dentro del tablero (uniqueID).
//funcion addCard agrega una nueva tarjeta al tablero y la representa en la interfaz de usuario.

/*  Drag n' Drop  */
var cardDrag_mouseDown = false;  
var cardDrag_mouseDownOn = null;  

const cardDrag_update = (e) => {

    if (!cardDrag_mouseDown && !cardDrag_mouseDownOn) return;

    // La tarjeta debe estar en las mismas coordenadas que el cursor del mouse.
    // Esto simula el efecto de que la tarjeta sea agarrada por el cursor.
    cardDrag_mouseDownOn.style.left = e.pageX + 'px';
    cardDrag_mouseDownOn.style.top = e.pageY + 'px';
};
//Las variables cardDrag_mouseDown y cardDrag_mouseDownOn se usan para rastrear si el usuario ha hecho clic en una tarea o elemento de tarjeta y 
//cuál es el elemento en el que hizo clic.
//funcion cardDrag_update actualiza la posición de un elemento que está siendo arrastrado para que siga el cursor del mouse.

const cardDrag_startDragging = (e) => {

    // Solo seleccionar elementos que son elementos de lista.
    if (e.target.tagName !== 'LI') return;

    cardDrag_mouseDown = true;
    cardDrag_mouseDownOn = e.target;

   // Establecer la posición del elemento en 'absolute'
    // Esto nos permite sacar el elemento del flujo del documento y jugar con sus coordenadas.
    cardDrag_mouseDownOn.style.position = 'absolute';

    // Habilitar el estilo de 'hover', que oscurece otras tarjetas y elementos cuando se pasa el mouse sobre ellos.
    toggleHoverStyle(true);
};

const cardDrag_stopDragging = (e) => {

   // Solo ejecutar el código de detener el arrastre si previamente el mouse estaba presionado en un elemento de lista.
    if (!cardDrag_mouseDown) return;

    // Deshabilitar el estilo de "hover" que evita que las tarjetas y elementos se oscurezcan al pasar el mouse sobre ellos.
    toggleHoverStyle(false);

    let _hoverCard = getMouseOverCard();
    if (_hoverCard) {
        let _hoverItem = getMouseOverItem();

         // Obtener el objeto del elemento de la tarjeta sobre el cual está el mouse.
        let _hoverCardObject = getCardFromElement(_hoverCard);
        // Obtener el objeto del elemento de la tarjeta que se está sosteniendo con el mouse.
        let _heldItemObject = getItemFromElement(cardDrag_mouseDownOn);
        
        if (_hoverCard === _heldItemObject.getParentCard()) {
            // Si la tarjeta sobre la que está el mouse es la misma que la tarjeta principal del elemento que se está sosteniendo con el mouse.
        // Solo tenemos que lidiar con el arrastre vertical.
        // Es decir, el usuario está cambiando el orden de los elementos.

            if (_hoverItem) {
                // Si se está pasando el mouse sobre un elemento.

                if (_hoverItem !== cardDrag_mouseDownOn) {
                     // Mientras el mouse no esté sobre el elemento que se está arrastrando.
                    let _hoverItemObject = getItemFromElement(_hoverItem);
                    // Mueve la posición del elemento sostenido a la posición del elemento sobre el cual se pasa el mouse.
                // Esto empujará hacia abajo el elemento sobre el que se pasó el mouse, con el elemento sostenido ocupando su lugar.
                    _hoverCardObject.items.move(_hoverCardObject.items.indexOf(_heldItemObject), _hoverCardObject.items.indexOf(_hoverItemObject));
                }
            }

            renderCard(_heldItemObject.getParentCard().id);

        } else {
            // Si la tarjeta sobre la que está el mouse no es la misma que la tarjeta principal del elemento que se está sosteniendo con el mouse.
        // El usuario también tiene la capacidad de mover un elemento a otra tarjeta.
        // Por lo tanto, aquí trataremos con ambas lógicas, es decir, entre tarjetas y mover elementos si se pasa el mouse sobre uno.

            if (_hoverItem) {
               

                if (_hoverItem !== cardDrag_mouseDownOn) {
                    // Mientras el mouse no esté sobre el elemento que se está arrastrando.

                    let _hoverItemObject = getItemFromElement(_hoverItem);

                    // Obtener el objeto de la tarjeta principal del elemento sobre el cual se pasa el mouse.
                    let _hoverItemParentObject = getCardFromElement(_hoverItemObject.getParentCard());

                   // Insertar el elemento sostenido en la posición del elemento sobre el cual se pasa el mouse.
                // Esto empujará hacia abajo el elemento sobre el que se pasa el mouse, con el elemento sostenido ocupando su lugar.
                    _hoverItemParentObject.items.insert(_hoverItemParentObject.items.indexOf(_hoverItemObject), _heldItemObject);

                     // Eliminar el elemento sostenido de su tarjeta original.
                    getCardFromElement(_heldItemObject.getParentCard()).removeItem(_heldItemObject);
                    // Asignar al elemento sostenido un nuevo ID de tarjeta principal.
                    _heldItemObject.parentCardId = _hoverItemParentObject.id;
                }
            } else {
                // Si no se está pasando el mouse sobre un elemento y, en cambio, se pasa el mouse directamente sobre la tarjeta.

            // Empujar directamente el elemento sostenido a la lista de elementos de la tarjeta sobre la que se pasa el mouse.
                _hoverCardObject.items.push(_heldItemObject);

                 // Eliminar el elemento sostenido de su tarjeta original.
                getCardFromElement(_heldItemObject.getParentCard()).removeItem(_heldItemObject);
                // Asignar al elemento sostenido un nuevo ID de tarjeta principal.
                _heldItemObject.parentCardId = _hoverCardObject.id;
            }

            renderCard(_hoverCardObject.id);
            renderCard(_heldItemObject.getParentCard().id);
        }
    }
    cardDrag_mouseDown = false;
    cardDrag_mouseDownOn.style.position = 'static';
    cardDrag_mouseDownOn = null;
};
//funcion q se ejecuta cuando el usuario suelta el clic del mouse.Restablece las variables relacionadas 
//con el arrastre y desactiva el estilo de hover.

//Arrastrar Elementos entre Tarjetas y Cambiar el Orden de las Tareas 
e_mainContainer.addEventListener('mousemove', cardDrag_update);
//cuando movemos tarjeta se verifica si esta en otra tarjeta o no
e_mainContainer.addEventListener('mouseleave', cardDrag_stopDragging, false);
//cuando dejamos tarjeta se verifica si esta en otra tarjeta o no
window.addEventListener('mouseup', cardDrag_stopDragging, false);
//se actualizan los obbjectos del dato

/*  Drag Scrolling  */
//variables q usamos para rastrear el estado del desplazamiento por arrastre y la posición inicial.


let scroll_mouseDown = false;
let scroll_startX, scroll_scrollLeft;

//funciones
const scroll_startDragging = (e) => {
    scroll_mouseDown = true;
    scroll_startX = e.pageX - e_mainContainer.offsetLeft;
    scroll_scrollLeft = e_mainContainer.scrollLeft;
};
//funcion que ejecuta cuando el usuario hace clic en el contenedor principal de tarjetas para comenzar el desplazamiento por arrastre.
//toma la posición inicial y la posición actual del desplazamiento.

const scroll_stopDragging = (e) => {
    scroll_mouseDown = false;
};
//funcion que ejecuta cuando el usuario deja de hacer clic, lo que finaliza el desplazamiento por arrastre.

const scroll_update = (e) => {
    e.preventDefault();
    if(!scroll_mouseDown || cardDrag_mouseDown) return;

    let _scroll = (e.pageX - e_mainContainer.offsetLeft) - scroll_startX;
    e_mainContainer.scrollLeft = scroll_scrollLeft - _scroll;
};
//funcion que actualiza la posición de desplazamiento mientras el usuario mueve el contenido del contenedor principal.
//Asegura que el desplazamiento solo ocurra si el usuario ha iniciado un desplazamiento y no está arrastrando un elemento de tarea al mismo tiempo.

// Eventos q escuchan en js
e_mainContainer.addEventListener('mousemove', scroll_update);
//Cuando el mouse se mueve sobre e_mainContainer, llamamos a función scroll_update. 
e_mainContainer.addEventListener('mousedown', scroll_startDragging, false);
//Cuando el mouse hace click sobre e_mainContainer, llamamos a función scroll_startDragging
e_mainContainer.addEventListener('mouseup', scroll_stopDragging, false);
//Cuando soltamos el mouse en e_mainContainer, llamamos a función scroll_stopDragging
e_mainContainer.addEventListener('mouseleave', scroll_stopDragging, false);
//Cuandoel mouse sale de la zona de e_mainContainer, llamamos a función scroll_stopDragging(ya que aplica para
//detener proceso de arrastre tanto como para cuando saca el mouse de un elemento y cuando saca el mouse del area de la vista principal
//ya q osino estaria todo el tiempo ejecutandose)


/*  Menu de tarjetas  */


let cardContextMenu_currentCard;
const cardContextMenu_show = (e) => {

    cardContextMenu_currentCard = getMouseOverCard();

    const { clientX: mouseX, clientY: mouseY } = e;
    e_cardContextMenu.style.top = mouseY + 'px';
    e_cardContextMenu.style.left = mouseX + 'px';

    e_cardContextMenu.classList.remove('visible');
    setTimeout(() => {
        e_cardContextMenu.classList.add('visible');
    });

};
//funcion q la usamos cuando se hace clic en una tarjeta. 
//Muestra el menú contextual en las coordenadas donde se hizo clic en la tarjeta. Se asegura de que el menú contextual esté visible.

const cardContextMenu_hide = (e) => {
    if (e.target.offsetParent != e_cardContextMenu && e_cardContextMenu.classList.contains('visible')) {
        e_cardContextMenu.classList.remove("visible");
    }
};
// funcion q la usamos cuando se hace clic en cualquier parte del cuerpo del documento. 
//Si el clic se realiza fuera del menú contextual y el menú contextual está visible, se oculta el menú contextual.

const cardContextMenu_clearCard = () => {
    createConfirmDialog('Quieres vaciar esta tabla?', () => {
        let _currentCardObject = getCardFromElement(cardContextMenu_currentCard);

        _currentCardObject.items.length = 0;
        renderCard(_currentCardObject.id);
    });
};
// funcion q la usamos cuando el usuario selecciona la opción "Vaciar tabla" en el menú contextual. Muestra un cuadro de diálogo de confirmación
// para asegurarse de que el usuario quiere eliminar todos los elementos de la tarjeta. Si el usuario confirma, elimina todos los elementos de la tarjeta.

const cardContextMenu_deleteCard = () => {
    createConfirmDialog('Deseas borrar esta tabla?', () => {
        let _currentCardObject = getCardFromElement(cardContextMenu_currentCard);

        currentCards().splice(currentCards().indexOf(_currentCardObject), 1);
        cardContextMenu_hide({target:{offsetParent:'n/a'}}); // this is really stupid but it works, LoL

        renderCard(_currentCardObject.id);
    });
}
//funcion q la usamos cuando el usuario selecciona la opción "Borrar tabla" en el menú contextual. Muestra un cuadro de diálogo 
//de confirmación para asegurarse de que el usuario quiere eliminar la tarjeta completa. Si el usuario confirma, elimina la tarjeta.

const cardContextMenu_duplicateCard = () => {
    let _currentCardObject = getCardFromElement(cardContextMenu_currentCard);

    currentBoard().addCard();

    let _cIndex = currentBoard().cards.length - 1;
    currentBoard().cards[_cIndex].items = _currentCardObject.items;
    currentBoard().cards[_cIndex].name = _currentCardObject.name + ' Copy';

    renderCard(currentBoard().cards[_cIndex].id);
}
//funcion q la usamos cuando el usuario selecciona la opción "Duplicar tabla" en el menú contextual.
// Crea una copia de la tarjeta actual, incluyendo todos sus elementos, y la agrega a la lista de tarjetas en el mismo tablero.


document.body.addEventListener('click', cardContextMenu_hide);
e_cardContextMenuClear.addEventListener('click', cardContextMenu_clearCard);
e_cardContextMenuDelete.addEventListener('click', cardContextMenu_deleteCard);
e_cardContextMenuDuplicate.addEventListener('click', cardContextMenu_duplicateCard);

/* Persistent Data Storage */
//Es almacenamiento de datos de manera persistente, lo que significa que los datos se mantienen incluso después de que un programa se cierre o se reinicie.

function saveData() {
    window.localStorage.setItem('myNote-appData', JSON.stringify(appData));
}
//funcuion q toma el objeto appData y lo almacena en el almacenamiento local del navegador como una cadena JSON.
// Guarda los datos de la aplicación bajo la clave 'myNote-appData'.

function getDataFromLocalStorage() {
    return window.localStorage.getItem('myNote-appData');
}
//funcion q recupera los datos de la aplicación almacenados en el localStorage y los devuelve como una cadena. 


function loadData() {
    let _data = window.localStorage.getItem('myNote-appData');
    if (_data) {
        let _appData = JSON.parse(_data);

        // Dado que JSON no almacena funciones y otros elementos, 
        // tendremos que volver a inicializar las clases con los datos cargados.
        appData.settings = _appData.settings;
        
        // Establecer el tablero actual, si es válido. De lo contrario, establecerlo en cero.
        appData.currentBoard = _appData.currentBoard >= 0 ? appData.currentBoard : 0;
        
        // Establecer el identificador, si no es nulo. De lo contrario, mantener el valor actual.
        appData.identifier = _appData.identifier !== null ? appData.identifier : 0;
        
        // Llenar los datos con tableros.
        for (let _board of _appData.boards) {
            let _newBoard = new Board(_board.name, _board.id, _board.settings, _board.identifier);

            // Llenar el tablero con tarjetas.
            for (let _card of _board.cards) {
                let _newCard = new Card(_card.name, _card.id, _board.id);

                // Llenar las tarjetas con elementos.
                for (let _item of _card.items) {
                    let _newItem = new Item(_item.title, _item.description, _item.id, _card.id);
                    // Agregar el elemento a la tarjeta.
                    _newCard.items.push(_newItem);
                }
                // Agregar la tarjeta al tablero.
                _newBoard.cards.push(_newCard);
            }
            // Agregar el tablero a los datos de la aplicación.
            appData.boards.push(_newBoard);
        }

        // Generar el tablero.
        renderBoard(appData.boards[appData.currentBoard]);
    } else {
        // Si no se encuentra ningún dato en el almacenamiento local, establecer el tablero actual en cero.
        appData.currentBoard = 0;
        // Crear un tablero predeterminado.
        let _defaultBoard = new Board("Escritorio sin titulo", 'b0', {'theme': null});
        appData.boards.push(_defaultBoard);
    }
    // Listar los tableros disponibles.
    listBoards();
}
//funcion q se utiliza para cargar datos previamente guardados en el localStorage. 
//1)verifica si existen datos en el almacenamiento local. Si existen, los datos se cargan y se utilizan para restaurar el estado de la aplicación.
// Si no se encuentran datos, se crea un nuevo objeto appData con un "tablero" (board) predeterminado.


function clearData() {
    window.localStorage.clear();
}
//funcion q limpia todo el almacenamiento local del navegador. Elimina todos los datos guardados bajo cualquier clave en localStorage. 

loadData();
//funcion q llama al cargar la página o la aplicación. Carga datos previamente guardados si están disponibles osino, inicializa la aplicación
// con datos predeterminados.

/*  Eventos  */
e_addCardText.addEventListener('keyup', (e) => {
    if (e.code === "Enter") currentBoard().addCard();
});
//Cuando el usuario presiona una tecla, se dispara este evento,añade tarjeta.

e_addCardButton.addEventListener('click', () => currentBoard().addCard());
//Cuando el usuario presiona un click, se dispara este evento,añade tarjeta.

e_addBoardText.addEventListener('keyup', (e) => {
    if (e.code === "Enter") addBoard();
});
//Cuando el usuario presiona una tecla, se dispara este evento,añade tabla.
e_addBoardButton.addEventListener('click', addBoard);
//Cuando el usuario presiona un click, se dispara este evento,añade tabla.

e_saveButton.addEventListener('click', () => {saveData(); createAlert("Datos guardados exitosamente")});
//Cuando el usuario presiona un click, se dispara este evento,guarda info y muestra mensaje.

e_deleteButton.addEventListener('click', () => {
    createConfirmDialog('Deseas borrar este escritorio?', () => {
        let _boardName = currentBoard().name;
        //Esta lógica elimina el tablero actual, ajusta el tablero actual si
        // no era el primero y, si no quedan tableros, crea un nuevo tablero predeterminado llamado "Escritorio sin titulo."
        appData.boards.splice(appData.currentBoard, 1);
        if (appData.currentBoard !== 0) {
            appData.currentBoard--;
        }

        if (appData.boards.length === 0) {
            let _defaultBoard = new Board("Escritorio sin titulo", 'b0', {'theme': null});
            appData.boards.push(_defaultBoard);
            appData.currentBoard = 0;
        }

        listBoards();
        renderBoard(appData.boards[appData.currentBoard]);

        createAlert(`Escritorio Eliminado "${_boardName}"`)
    });
});
//funcion para eliminar escritorio

window.onbeforeunload = function () {
    if (JSON.stringify(appData) !== getDataFromLocalStorage()) {
        return confirm();
    }
}
//define una función anónima que se ejecuta cuando el usuario intenta cerrar la ventana o la pestaña del navegador.
/*  Sidebar */
function toggleSidebar() {
    if (('toggled' in e_sidebar.dataset)) {
        delete e_sidebar.dataset.toggled;
        e_sidebar.style.width = "0";
        e_sidebar.style.boxShadow = "unset";

        document.removeEventListener('click', listenClickOutside);
    } else {
        e_sidebar.dataset.toggled = '';
        e_sidebar.style.width = "250px";
        e_sidebar.style.boxShadow = "100px 100px 0 100vw rgb(0 0 0 / 50%)";
        setTimeout(() => {
            document.addEventListener('click', listenClickOutside);
        }, 300);
    }
}
//funcion q permite alternar la visibilidad de la barra lateral. 
//Si el atributo toggled está presente en el dataset de e_sidebar, significa que la barra lateral está visible.
// En este caso, la función elimina el atributo toggled del dataset, establece el ancho de la barra lateral en cero y elimina cualquier sombra.
//Si el atributo toggled no está presente, se agrega al dataset, y 
//la barra lateral se expande a un ancho de 250px con una sombra para oscurecer el contenido principal.
// Además, se agrega un evento para escuchar clics fuera de la barra lateral para poder cerrarla si el usuario hace clic en otro lugar.

e_sidebarButton.addEventListener('click', toggleSidebar);
//cuando se hace click se abre la barra lateral
e_sidebarClose.addEventListener('click', toggleSidebar);
//cuando se hace click se cierra la barra lateral

/* Alerts */

function createAlert(text) {
    //crea un div y un p  para contener la aalerta dentro de el
    let _e = document.createElement('div');
    let _p = document.createElement('p');
    _p.innerText = text;
    _e.classList.add('alert');
    //lo pone como hijo
    _e.appendChild(_p);

    e_alerts.appendChild(_e);
    //agrega animacion con un lapso de tiempo
    setTimeout(function(){
        _e.classList.add('animate-hidden');
    }, 3500);
    //agrega para eliminar pasado un lapso de tiempo
    setTimeout(function(){
        _e.parentNode.removeChild(_e);
    }, 4500);
}
//funcion q se utiliza para crear y mostrar una alerta en la interfaz de la aplicación

function listenClickOutside(event) {
    const _withinBoundaries = event.composedPath().includes(e_sidebar);
    if (!_withinBoundaries && e_sidebar.style.width === "250px") {
        toggleSidebar();
    }
}
//funcion q se utiliza para escuchar clics fuera del área de la barra lateral (e_sidebar) y cerrar la barra lateral si está abierta.

function createConfirmDialog(text, onConfirm) {
    //Oculta cualquier menú contextual que pueda estar abierto 
    cardContextMenu_hide({target:{offsetParent:'n/a'}});

    var _modal = document.getElementById("confirm-dialog");
    var _span = document.getElementById("confirm-dialog-close");
    var _dialogText = document.getElementById('confirm-dialog-text');
    var _cancelButton = document.getElementById('confirm-dialog-cancel');
    var _confirmButton = document.getElementById('confirm-dialog-confirm');

    _modal.style.display = "block";
    _dialogText.textContent = text;

    _span.onclick = function() {
        _modal.style.display = "none";
    }
    
    _cancelButton.onclick = () => {
        _modal.style.display = "none";
    }

    _confirmButton.onclick = () => {
        _modal.style.display = "none";
        onConfirm && onConfirm();
    }

    window.onclick = (event) => {
        if (event.target === _modal) {
            _modal.style.display = "none";
        }
    }
}
//funcion q crea un cuadro de diálogo de confirmación en la interfaz de la aplicación