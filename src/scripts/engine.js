const state ={
    
    score:{
        jogadorPontos: 0,
        computadorPontos: 0,
        pontuacaocaixa: document.getElementById("pontos"),
    },
    infoCartas:{
        avatar: document.getElementById("imagem-carta"),
        nome: document.getElementById("nome-carta"),
        tipo: document.getElementById("tipo-carta"),
    },
    fieldCartas:{
        jogador: document.getElementById("campo-carta-jogador"),
        computador: document.getElementById("campo-carta-computador"),
    
    },
    players:{
        jogador: "jogador",
        caixaP1: document.querySelector("#jogador"),
        computador: "computador",
        caixaPc: document.querySelector("#computador"),
    },
    actions: {
        botao: document.getElementById("proximo-duelo"),
    },
};
const pathImages = "./src/assets/icons/";

const dadosCarta = [

    {
        id: 0,
        nome: "Dragão Branco",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        ganha:[1],
        perde:[2],
    },
    {
        id: 1,
        nome: "Mago Negro",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        ganha:[2],
        perde:[0],
    },
    {
        id: 2,
        nome: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        ganha:[0],
        perde:[1],
    }
];

async function getIdCartaAleatoria(){
    const randomIndex = Math.floor(Math.random() * dadosCarta.length);
    return dadosCarta[randomIndex].id;
}
async function createImagemCarta(IdCarta, ladoCampo ){
    const imagemCarta = document.createElement("img");
    imagemCarta.setAttribute("height", "100px");
    imagemCarta.setAttribute("src", "./src/assets/icons/card-back.png");
    imagemCarta.setAttribute("data-id", IdCarta);
    imagemCarta.classList.add("card");

    if(ladoCampo === state.players.jogador){
        
        imagemCarta.addEventListener("click", ()=>{
            setCampoCarta(imagemCarta.getAttribute("data-id"));
        });

        imagemCarta.addEventListener("mouseover", ()=>{
            drawCartaSelecionada(IdCarta);
        });
    }
    return imagemCarta;
}
async function setCampoCarta(IdCarta){
    await removeTodasAsCartas();

    let computadorIdCarta = await getIdCartaAleatoria();

    state.fieldCartas.jogador.style.display = "block";
    state.fieldCartas.computador.style.display = "block";

    await limparInfoCartas();

    state.fieldCartas.jogador.src = dadosCarta[IdCarta].img;
    state.fieldCartas.computador.src = dadosCarta[computadorIdCarta].img;

    let resultadoDuelo = await verifiResultadoDuelo(IdCarta, computadorIdCarta);

    await atualizarPontos();
    await ativaBotao(resultadoDuelo);

}
async function limparInfoCartas(){

    state.infoCartas.avatar.src = "";
    state.infoCartas.nome.innerText = "";
    state.infoCartas.tipo.innerText = "";

}
async function ativaBotao(texto){
    state.actions.botao.innerText = texto;
    state.actions.botao.style.display = "block";

}
async function atualizarPontos(){
    state.score.pontuacaocaixa.innerText = `Win: ${state.score.jogadorPontos} | Lose: ${state.score.computadorPontos}`;
}
async function verifiResultadoDuelo(idJogador, idComputador){
    let resultado = "Empate";

    let cartaJogador = dadosCarta[idJogador];

    if(cartaJogador.ganha.includes(idComputador)){
        resultado = "Ganhou";
        state.score.jogadorPontos++;
    }
    if(cartaJogador.perde.includes(idComputador)){
        resultado = "Perdeu";
        state.score.computadorPontos++;
    }
    await tocarAudio(resultado);

    return resultado;
}   
async function removeTodasAsCartas(){
    let { caixaPc, caixaP1} = state.players;
    let imgElements = caixaPc.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cartas = state.players.caixaP1;
    imgElements = caixaP1.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());


}
async function drawCartaSelecionada(index){
    state.infoCartas.avatar.src = dadosCarta[index].img;
    state.infoCartas.nome.innerText = dadosCarta[index].nome;
    state.infoCartas.tipo.innerText = `Tipo: ${dadosCarta[index].type}`;
}

async function drawCartas(numerodeCartas, ladoCampo){
    for(let i=0; i<numerodeCartas; i++){
        const randomIdCarta = await getIdCartaAleatoria();
        const imagemCarta = await createImagemCarta(randomIdCarta, ladoCampo);

        document.getElementById(ladoCampo).appendChild(imagemCarta);
    }
}
async function resetarDuelo(){
    state.infoCartas.avatar.src = "";
    state.actions.botao.style.display = "none";

    state.fieldCartas.jogador.src = "";
    state.fieldCartas.computador.src = "";
    init();

}
async function tocarAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}
function init(){
    drawCartas(5, state.players.jogador);
    drawCartas(5, state.players.computador);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();