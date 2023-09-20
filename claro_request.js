const puppeteer = require('puppeteer');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');

async function realizar_Pago(token, num_orden, number){
    try { 
        const url = 'https://motordepagos.claro.com.pe/MotorPagosWeb/datapower/realizarPago2'

        let data = {
            'urlPortal': 'https://compras.miclaro.com.pe/wps/portal/comprasclaro/',
            'tipoCompra': '13',
            'medioPago': '3',
            'numeroOrdenPortal': `${num_orden}`,
            'telefono': `${number}`,
            'monto': '5.00',
            'token': `${token}`,
            'codigoPortal': '1',
            'urlTimeoutSesion': 'http://compras.miclaro.com.pe',
            'transactionFunction': ''
        }

        let add_ext = {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8,ja;q=0.7',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Origin': 'https://compras.miclaro.com.pe',
                'Referer': 'https://compras.miclaro.com.pe/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
                'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"'
              }
        }

        const httpsAgent = new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            rejectUnauthorized: false,
        });
        
        const axiosInstance = axios.create({
            httpsAgent: httpsAgent,
        });

        const response = await axiosInstance.post(url, data, add_ext);
        console.log(response['data']['cuentaCliente']);
        const pruebxdd = response['data']['cuentaCliente']
        return pruebxdd

    }catch (error) {
        console.error('Error al hacer la solicitud:', error);
        throw error;
    }
}

async function get_titular(number, res){
    const minimal_args = [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ];

    const browserOptions = {
        headless: 'new',
        args: minimal_args
	};

    const browser = await puppeteer.launch( browserOptions );
    try {
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await client.send('Network.clearBrowserCache');

        const url = 'http://compras.miclaro.com.pe/wps/portal/rootcompras?cn=26&amp;rec=1';
        await page.setRequestInterception(true);

        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
            req.abort();
            } else {
            req.continue();
            }
        });

        await page.goto(url, {waitUntil: 'networkidle2'});

        //await page.waitForTimeout(1000);

        const pageContent = await page.content();

        const nuevaPaginaURL = page.url();
        const nueva_url = nuevaPaginaURL.replace('num=', `num=${number}`)

        await page.goto(nueva_url, {waitUntil: 'domcontentloaded'});

        const cookies = await page.cookies();

        //console.log(cookies)

        const result = await page.evaluate(() => {
            const xd = urlComprasyPAgos;
            return xd
        })

        const url_verificar_linea = result['obtenerTipoClienteNoAutenticado'];
        const url_recar_tc = result['registrarRecargaTC'];

        await browser.close();

        const ver_linea = await verificar_linea(url_verificar_linea, nueva_url, cookies, number);

        if (ver_linea != "0"){
            return res.json({ coError: '001', message: 'No se encontro informacion.' });
        }

        const xdddd = await obtener_token(url_recar_tc, nueva_url, cookies, number);

        delete xdddd.nroIp;
        
        return res.json({ coError: '999', mensaje: 'Consulta realizada correctamente.', data: xdddd });
    }catch (error){
        console.error('Error en test:', error);

        res.status(500).json({ coError: '500', mensaje: 'Ocurrió un error al obtener el titular.' });
    }
}

async function obtener_token(url, url_refer, cookies, number){
    try { 
        const jsessionid_x = cookies.find(c => c.name == 'JSESSIONID');
        let jsessionid = null;
        if (!jsessionid_x){ jsessionid = ''; } else { jsessionid = jsessionid_x['value']; }

        const _ga_Z4J6QEPB8Y_x = cookies.find(c => c.name == '_ga_Z4J6QEPB8Y');
        let _ga_Z4J6QEPB8Y = null;
        if (!_ga_Z4J6QEPB8Y_x){ _ga_Z4J6QEPB8Y = ''; } else { _ga_Z4J6QEPB8Y = _ga_Z4J6QEPB8Y_x['value']; }

        const _ga_x = cookies.find(c => c.name == '_ga');
        let _ga = null;
        if (!_ga_x){ _ga = ''; } else { _ga = _ga_x['value'];}

        const _ga_6ZZPD9S8SZ_x = cookies.find(c => c.name == '_ga_6ZZPD9S8SZ');
        let _ga_6ZZPD9S8SZ = null;
        if (!_ga_6ZZPD9S8SZ_x){ _ga_6ZZPD9S8SZ =  'GS1.1.1694897205.166.1.1694902319.0.0.0'; } else { _ga_6ZZPD9S8SZ =  _ga_6ZZPD9S8SZ_x['value']; }

        let add_ext = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8,ja;q=0.7',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Cookie': `_ga=${_ga}; JSESSIONID=${jsessionid}; _ga_Z4J6QEPB8Y=${_ga_Z4J6QEPB8Y}; _ga_6ZZPD9S8SZ=${_ga_6ZZPD9S8SZ}`,
                'Origin': 'https://compras.miclaro.com.pe',
                'Referer': `${url_refer}`,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            }
        }

        const httpsAgent = new https.Agent({
            //secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            rejectUnauthorized: false,
        });
        
        const axiosInstance = axios.create({
            httpsAgent: httpsAgent,
        });

        const response = await axiosInstance.post(url, 'requestJson=%7B%22userAgent%22:null,%22idProductoDeCompra%22:%22662%22,%22idCategoriaDeCompra%22:%225%22,%22idCategoria%22:null,%22codigoCategoria%22:%224%22,%22idMetodoPago%22:%223%22,%22claroPuntosCliente%22:null,%22importePago%22:%225%22,%22precioPuntos%22:null,%22precioMoneda%22:null,%22tipoValidacion%22:null,%22vigenciaProducto%22:null,%22codTipoLinea%22:%221%22,%22nombreComprador%22:%22%22,%22nombreBeneficiario%22:%22%22,%22emailBeneficiario%22:%22%22,%22mensaje%22:%22%22,%22flagCopiaComprador%22:%220%22,%22isPaymentEngine%22:%221%22,%22flagFavorito%22:null,%22admin%22:%220%22,%22notificacionURLImage%22:null,%22fechaSorteoCanje%22:null,%22asuntoCorreoCanje%22:null,%22textoNotificacionCorreoCanje%22:null,%22linkCondicionesSorteo%22:null,%22canalTemporal%22:%2226%22,%22marketActivity%22:null%7D', add_ext);
        //console.log(response['data']['comunResponseType']['MessageResponse']['Body']);

        const token = response['data']['comunResponseType']['MessageResponse']['Body']['motorPagosToken'];
        const num_orden = response['data']['comunResponseType']['MessageResponse']['Body']['numeroOrden'];

        const xdasd = await realizar_Pago(token, num_orden, number)
        return xdasd

    }catch (error) {
        console.error('Error al hacer la solicitud:', error);
        throw error;
    }
}

async function verificar_linea(url, url_refer, cookies, number){
    try { 
        const jsessionid_x = cookies.find(c => c.name == 'JSESSIONID');
        let jsessionid = null;
        if (!jsessionid_x){ jsessionid = ''; } else { jsessionid = jsessionid_x['value']; }

        const _ga_Z4J6QEPB8Y_x = cookies.find(c => c.name == '_ga_Z4J6QEPB8Y');
        let _ga_Z4J6QEPB8Y = null;
        if (!_ga_Z4J6QEPB8Y_x){ _ga_Z4J6QEPB8Y = ''; } else { _ga_Z4J6QEPB8Y = _ga_Z4J6QEPB8Y_x['value']; }

        const _ga_x = cookies.find(c => c.name == '_ga');
        let _ga = null;
        if (!_ga_x){ _ga = ''; } else { _ga = _ga_x['value'];}

        const _ga_6ZZPD9S8SZ_x = cookies.find(c => c.name == '_ga_6ZZPD9S8SZ');
        let _ga_6ZZPD9S8SZ = null;
        if (!_ga_6ZZPD9S8SZ_x){ _ga_6ZZPD9S8SZ =  'GS1.1.1694933951.168.1.1694934177.0.0.0'; } else { _ga_6ZZPD9S8SZ =  _ga_6ZZPD9S8SZ_x['value']; }

        let add_ext = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8,ja;q=0.7',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Cookie': `_ga=${_ga}; _ga_Z4J6QEPB8Y=${_ga_Z4J6QEPB8Y}; JSESSIONID=${jsessionid}; _ga_6ZZPD9S8SZ=${_ga_6ZZPD9S8SZ}`,
                'Origin': 'https://compras.miclaro.com.pe',
                'Referer': `${url_refer}`,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            }
        }

        const httpsAgent_ver = new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            rejectUnauthorized: false,
        });
        
        const axiosInstance_ver = axios.create({
            httpsAgent: httpsAgent_ver,
        });

        //console.log(`_ga=${_ga}; _ga_Z4J6QEPB8Y=${_ga_Z4J6QEPB8Y}; JSESSIONID=${jsessionid}; _ga_6ZZPD9S8SZ=${_ga_6ZZPD9S8SZ}`)

        const data_rara = 'requestJson=%7B%22msisdn%22:%22949190401%22,%22codigocaptcha%22:%22%22,%22fuenteIngreso%22:%22WEB%22,%22autenticado%22:true,%22isPontisEnabled%22:null%7D'.replace('949190401', `${number}`)

        const response_ver = await axiosInstance_ver.post(url, data_rara, add_ext);
        //console.log(response['data']['comunResponseType']['MessageResponse']['Body']);
        const code_response = response_ver['data']['comunResponseType']['MessageResponse']['Body']['defaultServiceResponse']['idRespuesta']

        return code_response
    }catch (error) {
        console.error('Error al hacer la solicitud:', error);
        throw error;
    }
}

module.exports = get_titular;
//get_titular('949190401');