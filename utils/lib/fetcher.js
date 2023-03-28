export const fetcher = (url, options) => fetch(url, options)
    .then((res) => {
        const resJson = res.json();
        return resJson;
    })
    .catch(err=>{
        return {error:err};
    });