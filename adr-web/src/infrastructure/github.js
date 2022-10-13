import configData from '../config/config.json';
import React, { useState, useEffect } from 'react';

export const GetReposName = () => {
    let githubRepos = configData.repositories;
    let names = [];
    githubRepos.forEach(element => {
        let parseUrl = new URL(element.url);
        let paths = parseUrl.pathname;
        let repoName = paths.split('/');
        names.push(repoName[3]);
    });
    return names;
}

export const GetAdrs = () => {
    let result = [];
    
    fetch('https://api.github.com/repos/TulioHector/adr-tool/contents/adr-cli/doc/adr', { method: "GET"})
   .then(response => response.json())
   .then(data => {
    console.log("Es el respondo: "+data);
    data.map((name, index) => {
        result.push(name);
    });
    
   })
   .catch((err) => {
    console.log(err.message);
 });
 return result;
};