const all = document.getElementById('all');
const woman = document.getElementById('woman');
const man = document.getElementById('man');
const kids = document.getElementById('kids');
let container = document.getElementById('container');
let string = 'https://www.pre.desigual.com/dw/image/v2/BCVV_PRD/on/demandware.static/-/Sites-desigual-m-catalog/default/dw97ce96ee/images/B2C/';
let cont_woman = 0;
let cont_man = 0;
let cont_kids = 0;
let arr_Woman = [];
let arr_Man = [];
let arr_Kids = [];

let fra = document.getElementById('fra');
let fraDos = document.getElementById('fraDos');
//let arr_Fras = ['617','618','619','620'];
let archivoJson = '';
let jpg = '_X.jpg';

let obj = {};  //objeto para casa referencia.

let nav = document.getElementById('nav');
nav.style.display = 'none';

let form_home = document.getElementById('form_home');
//let fra_home = document.getElementsByClassName('.fra_home');

//deja una opcion por default en el select
let defaultOpc = document.createElement('option');

let menOpc = document.getElementById('eligeFra');
menOpc.style.display = 'none';

/*  ****************************  */
/*
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const h3 = document.getElementById('h3');
    const headerBott = header.getBoundingClientRect().bottom;

    headerBott <= 0 ? h3.style.display = 'none' : h3.style.display = 'block';

});
/*  ****************************  */

function SeleccionFra (numFra){
    let arr_Fras = ['617','618','619','620'];
    //deja una opcion por default en el select
    let defaultOpc = document.createElement('option');
    //let msm_default = document.createElement('h2');
    defaultOpc.textContent = '----';
    defaultOpc.value = '';
    defaultOpc.disabled = true;
    defaultOpc.selected = true;
    numFra.appendChild(defaultOpc);

    arr_Fras.forEach(i => {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        numFra.appendChild(option);
    });

    return numFra;
};

/*  ****************************  */
container.style.display = 'none';
/*  ****************************  */

let codFra = document.getElementById('codFra');

SeleccionFra(fraDos);
fraDos.addEventListener("change", () => {
        let seleccion = fraDos.value;
        archivoJson = `${seleccion}.json`;
        codFra.textContent = seleccion;
        cargarDatos(archivoJson);
    })

SeleccionFra(fra);
fra.addEventListener("change", () => {
        let seleccion = fra.value;
        archivoJson = `${seleccion}.json`;
        codFra.textContent = seleccion;
        cargarDatos(archivoJson);
    });

async function cargarDatos(fichero) {

    nav.style.display = 'block';
    form_home.style.display = 'none';
    container.style.display = 'flex';
    container.innerHTML = '';
    cont_woman=0;
    cont_man = 0;
    cont_kids = 0;
    arr_Man = [];
    arr_Woman = [];
    arr_Kids = [];

    menOpc.style.display = 'block';

    try {
        const response = await fetch('/json/'+fichero);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        for(let i=0; i<data.length; i++){

            let sku = data[i].Sku;

            let genero = sku.slice(3,4);
            let concatena = string+sku.slice(0,8)+"_"+sku.slice(8,12)+jpg;
            let picture = document.createElement('picture');
            let labelSku = document.createElement('p');
            let img = document.createElement('img');

            let name = data[i].Name;
            let labelName = document.createElement('p');
            labelName.textContent = name;

            //Se asigna al objeto los nombres con una clave unica SKU
            obj[sku] = {
                Name: name,
            };

            Genero(genero, sku);

            img.setAttribute('src', concatena);
            labelSku.textContent = sku;
            picture.appendChild(img);
            container.appendChild(picture);
            picture.appendChild(labelName);
            picture.appendChild(labelSku);
        }

        all.textContent = data.length;
        woman.textContent = cont_woman;
        man.textContent = cont_man;
        kids.textContent = cont_kids;


    } catch (error) {
            console.error('Error al leer el archivo JSON:', error);
        }

}

function Genero (genero,sku) {
    if(genero == 'W' || genero == 'A' || genero == 'S')
        {
            cont_woman++;
            arr_Woman.push(sku);
            return cont_woman;
        }
    if(genero == 'M' || genero == 'Z')
        {
            cont_man++;
            arr_Man.push(sku);
            return cont_man;
        }
    if(genero == 'G' || genero == 'B' || genero == 'Y' || genero == 'K')
        {
            cont_kids++;
            arr_Kids.push(sku);
            return cont_kids;
        };
};


let linkWoman = document.getElementById('linkWoman');
let linkMan = document.getElementById('linkMan');
let linkKids = document.getElementById('linkKids');
let linkAll = document.getElementById('linkAll');
let logo = document.getElementById('linkLogo');


logo.addEventListener("click", () => {
    //recarga la pagina
    document.location.reload();
})

linkAll.addEventListener("click", () => {
    cargarDatos(archivoJson);
})

linkWoman.addEventListener("click", () => {
    container.innerHTML = '';
    arr_Woman.forEach(i => {
        Card(i);
    });
})

linkMan.addEventListener("click", () => {
    container.innerHTML = '';
    arr_Man.forEach(i => {
        Card(i);
    });
});

linkKids.addEventListener("click", () => {
    container.innerHTML = '';
    arr_Kids.forEach(i => {
        Card(i);
    });
})

function Card (i) {
    let concatena = string+i.slice(0,8)+"_"+i.slice(8,12)+jpg;
    let picture = document.createElement('picture');
    let labelSku = document.createElement('p');
    let img = document.createElement('img');

    let labelName = document.createElement('p');
    labelName.textContent = obj[i].Name;

    img.setAttribute('src', concatena);
    labelSku.textContent = i;
    picture.appendChild(img);
    container.appendChild(picture);
    picture.appendChild(labelName);
    picture.appendChild(labelSku);
};