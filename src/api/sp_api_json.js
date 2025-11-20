import Config from '../configEnv.js';

export async function sp_api_contextInfo_json(uri){
    return await fetch(new Request(uri, 
        { 
        method: "POST",
        credentials: "include",
        headers: new Headers({
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json;odata=verbose",
        })
    })).then(response => {
        if (!response.ok) {
            throw new Error("La solicitud falló con un estado HTTP " + response.status);
          }
        return response.json();
    })
    .then(json => {
        return json.body === undefined? json.d : json.body.d;
    })
    .catch(err => console.log('Error:', err));
}

export async function sp_api_get_json(uri) {
    return await fetch(new Request(uri, 
        { 
            method: "GET",
            credentials: 'include', 
            headers: new Headers({
                "Accept": "application/json; odata=verbose"
            }) 
        }))
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud falló con un estado HTTP " + response.status);
              }
            return response.json();
        })
        .then(json => {
            return json.body === undefined ? json.d : json.body.d;
        })
        .catch(err => console.log('Error:', err));
}

export async function sp_api_post_json(uri, digest, data){
    return await fetch(new Request(uri, { 
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({
            "Accept": "application/json; odata=nometadata",
            "Content-Type": "application/json;odata=nometadata",
            'X-RequestDigest': digest.GetContextWebInformation.FormDigestValue
        }),
        body: JSON.stringify(data)
    }))
    .then(response => {
        if (!response.ok) {
            throw new Error("La solicitud falló con un estado HTTP " + response.status);
          }
        return response.json();
    })
    .catch(err => console.log('Error:', err));
}

export async function sp_api_post_json_file(uri, digest, fileData){
    return await fetch(new Request(uri, { 
        method: "POST",
        binaryStringRequestBody: true,
        credentials: "same-origin",
        headers: new Headers({
            // "Accept": "application/json; odata=nometadata",
            "Accept": "application/json; odata=verbose",
            // "Content-Type": "application/json;odata=nometadata",
            'X-RequestDigest': digest.GetContextWebInformation.FormDigestValue,
            "content-length": fileData.byteLength
        }),
        body: fileData
        // data: fileData,
        // processData: false,        
    }))
    .then(response => {
        if (!response.ok) {
            throw new Error("La solicitud falló con un estado HTTP " + response.status);
          }
        return response.json();
    })
    .catch(err => console.log('Error:', err));
}


export async function sp_api_update_json(uri, ifMatch, data){
    const digest = await sp_api_contextInfo_json(Config.urlContextInfo);
    return await fetch(new Request(uri, { 
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({
            "Content-Type": "application/json;odata=verbose",
            "X-HTTP-Method": "MERGE",
            "If-Match": ifMatch,
            'X-RequestDigest': digest.GetContextWebInformation.FormDigestValue}),
        body: JSON.stringify(data)
    }))
    .then(response => {
        // return response.json();
        if (!response.ok) {
            throw new Error("La solicitud falló con un estado HTTP " + response.status);
          }
        return response
    })
    .catch(err => console.log('Error:', err));
}

export async function sp_api_get_json_file(uri){
    return await fetch(new Request(uri, { 
        method: "GET",
        credentials: "include",
        headers: new Headers({
            "Accept": "application/json; odata=verbose",
            "Content-Type": 'application/json; odata=verbose',
            // 'X-RequestDigest': digest.GetContextWebInformation.FormDigestValue,
        })
       
    }))
    .then(response => {
        if (!response.ok) {
            throw new Error("La solicitud falló con un estado HTTP " + response.status);
          }
        return response.json();
    })
    .then(json => {
        return json.body === undefined ? json.d : json.body.d;
    })
    .catch(err => console.log('Error:', err));
}

export async function sp_api_comment(id, data) {
    const uri = `${Config.urlLinkSolicitudesTickets}(${id})/Comments`;
    const digest = await sp_api_contextInfo_json(Config.urlContextInfo);
    return await fetch(new Request(uri, {
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            'X-RequestDigest': digest.GetContextWebInformation.FormDigestValue
        }),
        body: JSON.stringify({  
                "__metadata":  
                {  
                    "type": "Microsoft.SharePoint.Comments.comment"  
                },  
                "text": data  
            })
    }))
    .then(response => {
        if (response.ok) {
            return true; // Éxito
        } else {
            throw new Error("La solicitud de comentario falló con un estado HTTP " + response.status);
        }
    })
    .catch(err => console.log('Error:', err));
}
