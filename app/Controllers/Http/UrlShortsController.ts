import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ShortUrl from 'App/Models/ShortUrl';

export default class UrlShortsController
{
    public async store({request, response}: HttpContextContract)
    {
        //iniciando um novo model
        const data = new ShortUrl();

        //validando url

        //guardando Url original enviada pelo usuario
        data.original_url = request.body().original_url;

        //gerando e guardando string randomica
        data.hash = Math.random().toString(36).substring(0,8);

        //salvando dados no banco
        await data.save();

        //montando url bruta
        const rawShortUrl = `${request.protocol()}://${request.host()}/${data.hash}`;

        //retornando url short bruta
        response.status(201);

        response.json({'original_url': rawShortUrl});
        
    }

    public  async show({response, params}: HttpContextContract)
    { 
        //pegando hash enviado por parametro da request
        const Hash = params.hash;
        
        //encontrando hash enviado no banco 
        const shortUrl =  await ShortUrl.query().where('hash', Hash).first();

        //verificando se hash existe
        if(shortUrl != null)
        {
            response.redirect(shortUrl.original_url);   
        }
        else
        {
            response.redirect('/');
        } 
        
    }
}
