let arr_Fras = ['653', '652', '651', '650', '649', '648', '647', '646', '645', '644', '643', '642', '641', '640'];
let grid = document.getElementById('grid');
let gridImg = document.getElementById('grid-img');
let title = document.getElementById('title');
let archivoJson = '';
let nav = document.getElementById('nav');
let codFra = document.getElementById('codFra');
let codFramobile = document.getElementById('codFramobile');
let label_all = document.getElementById('label_all');
let label_woman = document.getElementById('label_woman');
let label_man = document.getElementById('label_man');
let label_kids = document.getElementById('label_kids');
let linksNav = document.querySelectorAll('#nav a[data-filter]');
let listaFras = document.getElementById('lista-fras');
let cont_woman = 0, cont_man = 0, cont_kids = 0;
let linkImg = 'https://www.desigual.com/dw/image/v2/BCVV_PRD/on/demandware.static/-/Sites-desigual-m-catalog/default/dw97ce96ee/images/B2C/';


arr_Fras.forEach(i => {
    let p = document.createElement('div');
    p.textContent = i;
    p.className = "border rounded-lg p-6 shadow hover:bg-gray-100 cursor-pointer transform hover:scale-105 transition";

    p.addEventListener('click', () => {
        grid.style.display = 'none';
        title.style.display = 'none';
        nav.style.display = 'block';
        codFra.textContent = i;
        codFramobile.textContent = i;
        archivoJson = `${i}.json`;
        cargarDatos(archivoJson);
    });

    let option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    listaFras.appendChild(option);

    grid.appendChild(p);
})

let defaultOpc = document.createElement('option');
defaultOpc.textContent = 'FRAs';
defaultOpc.disabled = true;
defaultOpc.selected = true;
listaFras.appendChild(defaultOpc);

listaFras.addEventListener("change", () => {
    let seleccion = listaFras.value;
    archivoJson = `${seleccion}.json`;
    codFra.textContent = seleccion;
    codFramobile.textContent = seleccion;
    gridImg.innerHTML = '';
    cargarDatos(archivoJson);
});

async function cargarDatos(fichero) {

    try {
        const response = await fetch('./json/' + fichero);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        linksNav.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const filter = e.target.closest('a').dataset.filter;
                Filtro(data, filter);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
        })

        muestraProducto(data);

        label_all.textContent = data.length;
        label_woman.textContent = cont_woman;
        label_man.textContent = cont_man;
        label_kids.textContent = cont_kids;

    } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
    }

}

function muestraProducto(data) {
    cont_woman = 0;
    cont_man = 0;
    cont_kids = 0;
    for (let i = 0; i < data.length; i++) {
        let genero = data[i].Sku.slice(3, 4);
        Genero(genero);
        let sku = data[i].Sku;
        let concatena = linkImg + sku.slice(0, 8) + "_" + sku.slice(8, 12) + '_X.jpg';
        let picture = document.createElement('picture');
        let img = document.createElement('img');
        let labelname = document.createElement('p');
        let labelSku = document.createElement('p');
        let linkStock = document.createElement('a')
        let name = data[i].Name;
        picture.className = 'bg-gray-200 border border-gray-700 pb-2 text-center font-semibold text-xs md:text-lg';
        img.className = 'p-2';
        img.setAttribute('src', concatena);
        labelname.textContent = name;
        labelSku.textContent = sku;

        linkStock.textContent = "Ver Stock"
        linkStock.href = "#"
        linkStock.className = "text-black-600 hover:underline";

        gridImg.appendChild(picture);
        picture.appendChild(img);
        picture.appendChild(labelname);
        picture.appendChild(labelSku);
        picture.appendChild(linkStock);

        linkStock.addEventListener("click", e => {
            e.preventDefault();
            mostrarCard(sku);
        })
    }
}

function mostrarCard(sku) {
    document.getElementById("stockCard").style.display = "block";
    document.getElementById("cardTitle").textContent = sku;

    let tiendas = document.getElementById("tiendas")
    let tallas = document.getElementById("tallas")
    cargarDatosDos(tiendas, tallas, sku)
}

async function cargarDatosDos(tiendas, tallas, refe) {
    const arr_tiendas = ["F099", "F220", "F249", "F258"]
    try {
        const response = await fetch("./json/stock/" + archivoJson);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);

        }
        //console.log(archivoJson)
        const data = await response.json();

        while (tiendas.children.length > 1) {
            tiendas.removeChild(tiendas.lastChild);
        }

        arr_tiendas.forEach(element => {
            let th = document.createElement("th");
            th.textContent = element
            tiendas.appendChild(th)
        });

        let mapaTallas = {};

        data.forEach(item => {
            if (item.Material === refe) {
                if (!mapaTallas[item.Tallas]) {
                    mapaTallas[item.Tallas] = {};
                }
                if (!mapaTallas[item.Tallas][item.Tienda]) {
                    mapaTallas[item.Tallas][item.Tienda] = 0;
                }
                mapaTallas[item.Tallas][item.Tienda] += item.Cantidad;
            }
        });

        tallas.innerHTML = ""
        Object.keys(mapaTallas).forEach((talla, index) => {
            let tr = document.createElement("tr");

            tr.className = (index % 2 === 0) ? "bg-white hover:bg-gray-200" : "bg-gray-100 hover:bg-gray-200";

            // Columna de talla
            let tdTalla = document.createElement("td");
            tdTalla.textContent = talla;
            tdTalla.className = "px-4 py-2 text-center font-semibold text-gray-700 border border-gray-300"
            tr.appendChild(tdTalla);

            // Columnas por tienda
            arr_tiendas.forEach(tienda => {
                let td = document.createElement("td");
                td.textContent = mapaTallas[talla][tienda] ?? 0; // si no existe, poner 0
                td.className = "px-4 py-2 text-center font-semibold text-gray-700 uppercase tracking-wide border border-gray-300"
                tr.appendChild(td);
            });
            tallas.appendChild(tr);
        });
    }

    catch (error) {
        console.log('Error al leer el archivo JSON:', error)
    }
}

function cerrarCard() {
    document.getElementById("stockCard").style.display = "none";
}

function Filtro(data, filter) {
    switch (filter) {
        case 'all':
            gridImg.innerHTML = '';
            muestraProducto(data);
            break;
        case 'woman':
            gridImg.innerHTML = '';
            const gridWoman = data.filter(w => {
                return w.Sku.slice(3, 4) == 'W' || w.Sku.slice(3, 4) == 'A' || w.Sku.slice(3, 4) == 'S';
            })
            muestraProducto(gridWoman);
            break;
        case 'man':
            gridImg.innerHTML = '';
            const gridMan = data.filter(m => {
                return m.Sku.slice(3, 4) == 'M' || m.Sku.slice(3, 4) == 'Z';
            })
            muestraProducto(gridMan);
            break;
        case 'kids':
            gridImg.innerHTML = '';
            const gridKids = data.filter(k => {
                return k.Sku.slice(3, 4) == 'G' || k.Sku.slice(3, 4) == 'B' || k.Sku.slice(3, 4) == 'Y' || k.Sku.slice(3, 4) == 'K';
            })
            muestraProducto(gridKids);
            break;
    }
}

function Genero(genero) {
    if (genero == 'W' || genero == 'A' || genero == 'S') {
        cont_woman++;
        return cont_woman;
    }
    if (genero == 'M' || genero == 'Z') {
        cont_man++;
        return cont_man;
    }
    if (genero == 'G' || genero == 'B' || genero == 'Y' || genero == 'K') {
        cont_kids++;
        return cont_kids;
    };
};