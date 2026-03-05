const languageSelect = document.getElementById("language");
const fileNameBox = document.getElementById("filename");
const outputBox = document.getElementById("output");
const inputBox = document.getElementById("input");
const runBtn = document.getElementById("runBtn");

let editor;

/* =========================
LANGUAGES
========================= */

const languages = [
{ id: 50, name:"C", mode:"c", file:"main.c" },
{ id: 54, name:"C++", mode:"cpp", file:"main.cpp" },
{ id: 51, name:"C#", mode:"csharp", file:"Main.cs" },
{ id: 62, name:"Java", mode:"java", file:"Main.java" },
{ id: 71, name:"Python", mode:"python", file:"main.py" },
{ id: 63, name:"JavaScript", mode:"javascript", file:"main.js" },
{ id: 60, name:"Go", mode:"go", file:"main.go" },
{ id: 72, name:"Ruby", mode:"ruby", file:"main.rb" },
{ id: 73, name:"Rust", mode:"rust", file:"main.rs" },
{ id: 68, name:"PHP", mode:"php", file:"main.php" },
{ id: 85, name:"Perl", mode:"perl", file:"main.pl" },
{ id: 43, name:"Plain Text", mode:"plaintext", file:"main.txt" }
];

/* =========================
TEMPLATES
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
FILL DROPDOWN
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

languageSelect.value="62"; // Default Java

updateFileName();

languageSelect.addEventListener("change",changeLanguage);

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
FILENAME
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

let isRunning=false;

runBtn.addEventListener("click",runCode);

async function runCode(){

if(isRunning) return;

isRunning=true;

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
input:inputBox?.value || ""
})

});

if(!res.ok){
throw new Error("Server error");
}

const result = await res.json();

outputBox.textContent =
result.output ||
result.error ||
"";

}catch(err){

outputBox.textContent="❌ Cannot connect to compiler server";

}

setTimeout(()=>{ isRunning=false },2000);

}