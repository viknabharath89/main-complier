const languageSelect = document.getElementById("language");
const fileNameBox = document.getElementById("filename");
const outputBox = document.getElementById("output");
const inputBox = document.getElementById("input");
const runBtn = document.getElementById("runBtn");

let editor;

/* =========================
JUDGE0 LANGUAGES (50+)
========================= */

const languages = [
{ id: 50, name:"C", mode:"c", file:"main.c" },
{ id: 54, name:"C++", mode:"cpp", file:"main.cpp" },
{ id: 51, name:"C# Mono", mode:"csharp", file:"main.cs" },
{ id: 62, name:"Java", mode:"java", file:"Main.java" },
{ id: 71, name:"Python", mode:"python", file:"main.py" },
{ id: 63, name:"JavaScript (Node)", mode:"javascript", file:"main.js" },
{ id: 72, name:"Ruby", mode:"ruby", file:"main.rb" },
{ id: 73, name:"Rust", mode:"rust", file:"main.rs" },
{ id: 74, name:"Kotlin", mode:"kotlin", file:"Main.kt" },
{ id: 60, name:"Go", mode:"go", file:"main.go" },
{ id: 68, name:"PHP", mode:"php", file:"main.php" },
{ id: 85, name:"Perl", mode:"perl", file:"main.pl" },
{ id: 83, name:"Swift", mode:"swift", file:"main.swift" },
{ id: 78, name:"Scala", mode:"scala", file:"Main.scala" },
{ id: 80, name:"R", mode:"r", file:"main.r" },
{ id: 81, name:"Haskell", mode:"haskell", file:"main.hs" },
{ id: 43, name:"Plain Text", mode:"plaintext", file:"main.txt" }
];

/* =========================
CODE TEMPLATES
========================= */

const templates = {

java:`public class Main {
    public static void main(String[] args){
        System.out.println("Hello World");
    }
}`,

python:`print("Hello World")`,

c:`#include<stdio.h>
int main(){
    printf("Hello World");
    return 0;
}`,

cpp:`#include<iostream>
using namespace std;

int main(){
    cout<<"Hello World";
    return 0;
}`,

javascript:`console.log("Hello World");`

};

/* =========================
FILL LANGUAGE DROPDOWN
========================= */

languages.forEach(lang=>{
const option=document.createElement("option");
option.value=lang.id;
option.textContent=lang.name;
languageSelect.appendChild(option);
});

/* =========================
MONACO EDITOR
========================= */

require.config({
paths:{vs:"https://unpkg.com/monaco-editor@0.45.0/min/vs"}
});

require(["vs/editor/editor.main"],function(){

editor = monaco.editor.create(document.getElementById("editor"),{

value:templates.java,
language:"java",
theme:"vs-dark",
automaticLayout:true,
minimap:{enabled:false},
fontSize:14

});

updateFileName();

languageSelect.addEventListener("change",changeLanguage);

editor.onDidChangeModelContent(function(){
updateFileName();
});

editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
runCode();
});

});

/* =========================
LANGUAGE CHANGE
========================= */

function changeLanguage(){

const id = parseInt(languageSelect.value);

const lang = languages.find(l=>l.id===id);

if(!lang) return;

monaco.editor.setModelLanguage(editor.getModel(),lang.mode);

if(templates[lang.mode]){
editor.setValue(templates[lang.mode]);
}

updateFileName();

}

/* =========================
FILENAME UPDATE
========================= */

function updateFileName(){

if(!editor) return;

const id = parseInt(languageSelect.value);
const lang = languages.find(l=>l.id===id);

if(!lang) return;

fileNameBox.textContent = lang.file;

}

/* =========================
RUN CODE
========================= */

runBtn.addEventListener("click",runCode);

async function runCode(){

outputBox.textContent="⚡ Running...";

try{

const res = await fetch("/api/compile",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

language_id:parseInt(languageSelect.value),
code:editor.getValue(),
input:inputBox.value

})

});

if(!res.ok){
throw new Error("Server not ready");
}

const result = await res.json();

outputBox.textContent = result.output || "";

outputBox.scrollTop = outputBox.scrollHeight;

}catch(err){

outputBox.textContent="⚠️ Server waking up... retrying in 5 seconds";

setTimeout(runCode,5000);

}

}