#pass.in Back-end

O pass.in é uma aplicação de gestão de participantes em eventos presenciais.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

##Requisitos

###Requisitos funcionais

- [ ] O organizador deve poder cadastrar um novo evento;
- [ ] O organizador deve poder visualizar dados do evento;
- [ ] O organizador deve poder visualizar lista de participantes;
- [ ] O participante deve poder se inscrever em eventos;
- [ ] O participante deve poder visualizar seu crachá de inscrição;
- [ ] O participante deve poder realizar check-in no evento;

###Regras de Negócio

- [ ] O participante só pode se inscrever em um evento uma unica vez;
- [ ] O participante só pode se inscrever em eventos que possuam vagas;
- [ ] O participante só pode realizar check-in uma unica vez;

###Requisitos não funcionais

- [ ] O check-in no evento será realizado via QRCode;
