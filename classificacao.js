function avanca(){
    PHFT_real = document.getElementById('PHFT_real').value;
    PHFT_ref = document.getElementById('PHFT_ref').value;
    CgTT_real = document.getElementById('CgTT_real').value;
    CgTT_ref = document.getElementById('CgTT_ref').value;
    TOmax_real = document.getElementById('tomax_real').value;
    TOmax_ref = document.getElementById('tomax_ref').value;
    TOmin_real = document.getElementById('tomin_real').value;
    TOmin_ref = document.getElementById('tomin_ref').value;
    area_condicionada = document.getElementById('area_condicionada').value;
    tipologia = document.getElementById('tipologia').value;
    zona_bioclimatica = document.getElementById('zb').value;

    lista_entradas = [PHFT_real, PHFT_ref, CgTT_real, CgTT_ref, TOmax_real, TOmax_ref, TOmin_real, TOmin_ref,
    area_condicionada, tipologia, zona_bioclimatica]

    desempenho = classificacao(PHFT_real, PHFT_ref, CgTT_real, CgTT_ref, TOmax_real, TOmax_ref, TOmin_real, TOmin_ref,
    area_condicionada, tipologia, zona_bioclimatica)

    if (lista_entradas.includes('')){
        window.alert('Existem elementos não preenchidos')

    }
    else{window.alert('O desempenho térmico da edificação analisada é: ' + desempenho)
}
    



    /*$('#resultados_modal').modal('show');

    document.getElementById('close-btn').addEventListener('click', () => {
    $('#resultados_modal').modal('hide');
    });*/
}


function classificacao(PHFT_real, PHFT_ref, CgTT_real, CgTT_ref, TOmax_real, TOmax_ref, TOmin_real, TOmin_ref,
area_condicionada, tipologia, zona_bioclimatica) {
if (tipologia == "unifamiliar" || (tipologia == "multi_cob"))
{
    deltaTOMAX = 2
} 
else {
    deltaTOMAX = 1
}

if (['ZB1', "ZB2", "ZB3", "ZB4"].includes(zona_bioclimatica))
{
deltaTOMIN = 1
} 
else {
deltaTOMIN = 100
}


calc_deltaTOMIN = TOmin_ref - TOmin_real
calc_deltaTOMAX = TOmax_real - TOmax_ref

if ((PHFT_real >= (0.9 * PHFT_ref)) && (calc_deltaTOMAX <= deltaTOMAX) && (calc_deltaTOMIN <= deltaTOMIN))
{
    minimo = 1
               }
else {
    minimo = 0
}


if (PHFT_ref >= 70){
    PHFT_70 = 1 
}
else{
    PHFT_70 = 0
}

if (CgTT_ref / area_condicionada >= 100) {
    condicao_area_100 = 1
} 
else{
    condicao_area_100 = 0
}

if (PHFT_70 == 0){
    red_carga_intermediario = 0
    if (tipologia == "unifamiliar"){
        delta_PHFT = 45 - 0.58 * PHFT_ref
    }
    else if (tipologia == "multi_cob"){
            delta_PHFT = 18 - 0.18 * PHFT_ref
    }
    else if (tipologia == "multi_inter"){
            delta_PHFT = 28 - 0.27 * PHFT_ref
    }
    else if (tipologia == "multi_terreo"){
            delta_PHFT = 22 - 0.21 * PHFT_ref
    }
}
    
else if (PHFT_70 == 1){
    delta_PHFT = 0
    if (condicao_area_100 == 0){
        if (tipologia == "unifamiliar"){
            red_carga_intermediario = 17
        }
        else if (tipologia == "multi_cob"){
            red_carga_intermediario = 15
        }
        else if (tipologia == "multi_inter"){
            red_carga_intermediario = 22
        }
        else if (tipologia == "multi_terreo"){
            red_carga_intermediario = 15
        }
    }

    else if (condicao_area_100 == 1){
        if (tipologia == "unifamiliar"){
            red_carga_intermediario = 27
        }
        else if (tipologia == "multi_cob"){
            red_carga_intermediario = 20
        }
        else if (tipologia == "multi_inter"){
            red_carga_intermediario = 25
        }
        else if (tipologia == "multi_terreo"){
            red_carga_intermediario = 20
        }
    }
}
        
    

calc_delta_PHFT = PHFT_real - PHFT_ref
calc_red_carga = (1 - (CgTT_real / CgTT_ref)) * 100

if(minimo == 1 && calc_delta_PHFT >= delta_PHFT && calc_red_carga >= red_carga_intermediario) {
    intermediario = 1
}
else {
    intermediario = 0
}

if (condicao_area_100 == 0){
    if (tipologia == "unifamiliar"){
        red_carga_superior = 35
        red_carga_d = -17
    }
    else if (tipologia == "multi_cob"){
        red_carga_superior = 30
        red_carga_d = -15
    }
    else if (tipologia == "multi_inter"){
        red_carga_superior = 45
        red_carga_d = -22
    }
    else if (tipologia == "multi_terreo"){
        red_carga_superior = 30
        red_carga_d = -15
    }
        
}
else if (condicao_area_100 == 1){
    if (tipologia == "unifamiliar"){
        red_carga_superior = 55
        red_carga_d = -27
    }
    else if (tipologia == "multi_cob"){
        red_carga_superior = 40
        red_carga_d = -20
    }
    else if (tipologia == "multi_inter"){
        red_carga_superior = 50
        red_carga_d = -25
    }
    else if (tipologia == "multi_terreo"){
        red_carga_superior = 40
        red_carga_d = -20
    }
        
}

if (minimo == 1 && calc_delta_PHFT >= delta_PHFT && calc_red_carga >= red_carga_superior){
    superior = 1 
} 
else {
    superior =  0
}

if (minimo == 1 && (0 > calc_red_carga >= red_carga_d)){
    minimo_d = 1 
} else {
    minimo_d = 0
}

if (superior == 1){
    desempenho = "Superior"
}

else if (superior == 0 && intermediario == 1){
    desempenho = "Intermediário"
}

else if (superior == 0 && intermediario == 0 && minimo == 1) {
    desempenho = "Mínimo" 
}

else if (minimo_d == 1){
    desempenho = "Mínimo para condições D"
}
else if (minimo == 0){
    erro1 = ""
    erro2 = ""
    erro3 = ""
    if (PHFT_real < (0.9 * PHFT_ref)) {
        erro1 = "confira os requisitos de PHFT para a edificação real - "
    }
    if (calc_deltaTOMAX > deltaTOMAX) {
        erro2 = "confira os requisitos de ΔTomáx para a edificação real - "
    }
    if (calc_deltaTOMIN > deltaTOMIN) {
        erro3 = "confira os requisitos de ΔTomin para a edificação real"
    } 
    desempenho = "Não atende aos requisitos mínimos da NBR 15575-1 - " + erro1 + erro2 + erro3
}
else {
    desempenho = 'ERRO'
}

return desempenho
}