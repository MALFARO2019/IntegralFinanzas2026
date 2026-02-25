# **Análisis de la Interconectividad Bancaria y el Ecosistema de Finanzas Abiertas en Costa Rica: Marco Normativo, Infraestructura Tecnológica y Perspectivas de Mercado**

El panorama financiero de la República de Costa Rica se encuentra en una coyuntura de transformación estructural, impulsada por la convergencia de una infraestructura tecnológica madura y un marco regulatorio que, si bien es robusto en términos de protección, plantea desafíos significativos para la apertura plena de datos a terceros. La cuestión central de si es posible conectar bancos con aplicaciones de terceros para proveer transacciones de clientes no admite una respuesta simplista; requiere un análisis multidimensional que abarque la arquitectura del Sistema Nacional de Pagos Electrónicos (SINPE), las disposiciones de la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley 8968), y las estrictas prohibiciones derivadas de la Ley Orgánica del Banco Central de Costa Rica (Ley 7558). A medida que el ecosistema fintech se expande, la demanda por servicios de agregación de cuentas e iniciación de pagos presiona las fronteras de la supervisión tradicional, obligando a los entes reguladores y a las instituciones financieras a reevaluar el equilibrio entre la innovación competitiva y la seguridad del sistema.

## **La Infraestructura del SINPE como Eje de la Interoperabilidad**

La piedra angular de cualquier proceso transaccional interconectado en Costa Rica es el Sistema Nacional de Pagos Electrónicos (SINPE). Este sistema, administrado y regulado por el Banco Central de Costa Rica (BCCR), ha evolucionado desde su creación en abril de 1997 para convertirse en una plataforma de servicios financieros y de apoyo que opera sobre una red privada de telecomunicaciones, conectando a entidades financieras, instituciones públicas y otros participantes autorizados.1 La eficiencia del SINPE es reconocida internacionalmente, habiendo facilitado una de las adopciones de pagos digitales más rápidas del mundo, particularmente a través de su servicio SINPE Móvil, lanzado en 2015 y acelerado exponencialmente desde 2020\.2

La interoperabilidad en Costa Rica no es un concepto teórico, sino una realidad operativa cotidiana. Para finales del segundo semestre de 2024, el 76% de la población mayor de 15 años se registra como usuaria activa de sistemas de pago rápido.2 El SINPE permite la movilización de fondos entre "cuentas cliente" mediante el uso del código IBAN, garantizando que las transacciones ocurran en tiempo real o de forma diferida, según el servicio suscrito por el afiliado.3 Esta capacidad de procesamiento abarca una amplia gama de participantes y modalidades, incluyendo transferencias P2P, P2B, B2B y transacciones gubernamentales (G2P, P2G).2

### **Evolución Histórica y Capacidad del Sistema Nacional de Pagos**

| Hito Histórico / Componente | Descripción y Relevancia Técnica |
| :---- | :---- |
| Lanzamiento de SINPE | 17 de abril de 1997; enfoque inicial en compensación de cheques.1 |
| Introducción de SINPE Móvil | 2015; permite vincular una cuenta de fondos a un número de teléfono móvil.2 |
| Adopción Masiva | Junio 2024: cerca de 3 millones de usuarios y 4 millones de cuentas activas.2 |
| Estándares de Mensajería | Transición hacia ISO 20022 y formatos JSON para interoperabilidad moderna.5 |
| Modelo de Liquidación | Bruta en tiempo real (LBTR) o neta diferida, según el servicio.2 |
| Disponibilidad del Servicio | 24 horas al día, 365 días al año para servicios como SINPE Móvil.3 |

La infraestructura del SINPE actúa como un "hub" centralizado que elimina la necesidad de conexiones bilaterales complejas entre bancos.5 Sin embargo, el acceso a esta red está estrictamente limitado a los "afiliados", definidos por el Reglamento del Sistema de Pagos como asociados, asociados regionales, organizadores de mercados y proveedores de servicios de pago (PSP) debidamente autorizados.7 Para que una aplicación de terceros pueda ejecutar transacciones, debe, o bien convertirse en un afiliado del SINPE bajo la supervisión del BCCR y la SUGEF, o bien integrarse a través de las interfaces de programación de aplicaciones (APIs) que los bancos afiliados decidan exponer.

## **Marco Jurídico de la Protección de Datos y Autodeterminación Informativa**

El intercambio de datos financieros entre bancos y aplicaciones de terceros está intrínsecamente ligado al derecho fundamental de la autodeterminación informativa. En Costa Rica, la Ley No. 8968, Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales, establece el marco regulatorio para cualquier entidad, pública o privada, que maneje bases de datos de carácter personal.9 El objetivo de esta ley es garantizar el respeto a los derechos fundamentales y la defensa de la libertad e igualdad en relación con el tratamiento automatizado o manual de los datos.11

Un principio rector de esta legislación es que la recopilación de datos requiere el consentimiento informado del titular. Este consentimiento debe ser expreso, preciso e inequívoco, y debe otorgarse de forma previa a la recolección.9 Para que una aplicación de terceros pueda conectarse a la cuenta de un cliente bancario, la entidad financiera y el tercero deben demostrar que el usuario ha autorizado explícitamente el flujo de su información transaccional. La Ley 8968 también establece el principio de calidad de la información, obligando a que los datos sean actuales, veraces y exactos.9

### **Clasificación de Faltas y Régimen de Sanciones según la Ley 8968**

El incumplimiento de las disposiciones de protección de datos conlleva sanciones que pueden afectar la viabilidad operativa de una fintech o una institución financiera.

| Categoría de Falta | Descripción de la Conducta Infractora |
| :---- | :---- |
| Falta Leve | Recolección de datos sin información suficiente al interesado o uso de mecanismos inseguros que no garanticen la inalterabilidad de los datos.9 |
| Falta Grave | Tratamiento de datos personales sin el consentimiento informado y expreso del titular; incumplimiento del deber de confidencialidad.9 |
| Falta Gravísima | Transferencia de datos personales a terceros países sin consentimiento; recolección de datos sensibles (biométricos, salud, socioeconómicos) sin autorización expresa.9 |

La manipulación de datos bajo protocolos inscritos ante la Agencia de Protección de Datos de los Habitantes (PRODHAB) hace presumir el cumplimiento de la ley para efectos de autorizar la cesión de datos.11 No obstante, en el sector financiero, esta facultad de cesión se ve colisionada por el secreto bancario. Aunque un cliente puede autorizar a una aplicación para que acceda a sus datos, el banco, como custodio, debe asegurarse de que dicha transferencia no vulnere las prohibiciones establecidas en su propia Ley Orgánica.13

## **El Secreto Bancario y las Restricciones de la Ley 7558**

El principal obstáculo legal para la implementación de un ecosistema de banca abierta (Open Banking) en Costa Rica es la rigidez del secreto bancario. El artículo 133 de la Ley Orgánica del Banco Central de Costa Rica (Ley 7558\) prohíbe taxativamente a los funcionarios, empleados y administradores de las entidades supervisadas y de la propia Superintendencia General de Entidades Financieras (SUGEF) suministrar a terceros cualquier dato de la información confidencial de los clientes.13

Esta prohibición no es meramente administrativa; conlleva sanciones penales severas. El incumplimiento de este deber de secreto es castigado con penas de prisión de tres a seis años, además de la destitución inmediata del cargo sin responsabilidad patronal.13 La circular SGF-2297-2025 de la SUGEF reitera la obligación de las entidades de gestionar adecuadamente los riesgos legales derivados del acceso a información crediticia.13 En este contexto, el suministro de datos a una aplicación de terceros, incluso si existe un consentimiento del cliente bajo la Ley 8968, camina sobre una línea delgada si no existe una normativa específica de rango legal que excepcione o regule esta entrega de información en el marco de la banca abierta.

### **Comparativa de Marcos Regulatorios: Privacidad vs. Apertura**

| Dimensión | Enfoque de la Ley 8968 (Protección) | Enfoque de la Ley 7558 (Secreto) |
| :---- | :---- | :---- |
| **Sujeto de Control** | El titular de los datos (el cliente) decide quién accede.9 | La entidad financiera tiene prohibido suministrar datos a terceros.13 |
| **Mecanismo de Apertura** | Consentimiento expreso y escrito (físico o digital).14 | Excepciones limitadas (orden judicial, autoridades tributarias).13 |
| **Consecuencia por Incumplimiento** | Multas administrativas y sanciones de la PRODHAB.9 | Prisión de 3 a 6 años y despido sin responsabilidad.13 |
| **Ámbito de Aplicación** | Todo tratamiento de datos personales en el país.11 | Específicamente datos financieros y crediticios supervisados.13 |

La SUGEF ha enfatizado que las autorizaciones para consultas en bases de datos como el Centro de Información Crediticia (CIC) deben ser diligentes y completas. Si una autorización presenta errores, se considera inválida, lo que califica cualquier acceso posterior como "indebido".13 Esta postura restrictiva busca prevenir el uso de la información para fines distintos a los autorizados, pero también ralentiza la adopción de modelos donde terceros agregan datos financieros para ofrecer mejores condiciones de crédito o asesoría patrimonial.

## **Capacidades Técnicas y Portales de APIs Bancarias**

A pesar de los desafíos legales, el sector bancario privado ha tomado la iniciativa de desarrollar portales de APIs (Interfaces de Programación de Aplicaciones) para facilitar la conectividad con clientes corporativos y comerciales. Esta "apertura controlada" permite que los sistemas financieros de las empresas se comuniquen directamente con el banco, eliminando procesos manuales y errores operativos.15

### **El Modelo de BAC Credomatic: API Center**

BAC Credomatic se posiciona como el líder regional en este ámbito, ofreciendo una plataforma basada en el estándar Open API diseñada para la integración rápida de startups, fintechs y empresas.15 Su oferta técnica se divide en varias categorías de servicios que permiten una automatización integral de la tesorería corporativa.

1. **API de Estado de Cuenta**: Proporciona acceso en tiempo real a los movimientos financieros, esencial para la conciliación contable automática en sistemas ERP.16  
2. **API de Consulta de Saldos**: Permite conocer la liquidez inmediata desde las propias aplicaciones del cliente.16  
3. **API de Pagos**: Facilita la dispersión de planillas y pagos a proveedores con estándares de seguridad que incluyen cifrado de datos y consentimientos por servicios.16

Este enfoque no solo mejora la eficiencia, sino que regionaliza la información, permitiendo que un mismo origen de datos sirva para operaciones en los seis países de Centroamérica donde opera la entidad.15

### **Scotiabank: Suite Scotia TranXact**

Scotiabank también ha desplegado un portal de desarrolladores con un catálogo robusto de APIs destinadas a la gestión de pagos y efectivo.17 Su infraestructura permite a los clientes corporativos embeber funcionalidades de pago directamente en sus aplicaciones nativas digitales.

* **Pagos en Tiempo Real**: Integración con esquemas locales e internacionales para transferencias inmediatas.17  
* **Validación de Cuentas**: Servicio para confirmar la existencia y titularidad de cuentas IBAN, reduciendo errores y previniendo fraudes en la carga de archivos de pago.17  
* **Seguimiento y Rastreo**: Funcionalidad para consultar el estado y los detalles asociados a transferencias bancarias mediante números de referencia únicos.17

El acceso a estos portales requiere un proceso formal de registro, evaluación de elegibilidad y aprobación, lo que asegura que solo socios de servicios financieros o clientes comerciales legítimos puedan interactuar con el "core" bancario.19 Este modelo de "jardín vallado" es la respuesta actual de la banca ante la falta de una ley de Open Banking que obligue a una apertura generalizada.

## **El Ecosistema Fintech y la Iniciación de Pagos**

El surgimiento de las fintechs en Costa Rica (61 empresas registradas en 2022\) ha introducido nuevos modelos de negocio que desafían la intermediación tradicional.21 Uno de los servicios más disruptivos es la "iniciación de pagos" o pagos cuenta a cuenta (A2A), que permite a un comercio aceptar pagos directamente desde la cuenta bancaria del comprador sin pasar por los esquemas de tarjetas de crédito.22

### **Mecanismos de Conexión de Agregadores Fintech**

Empresas como Prometeo actúan como plataformas de infraestructura que conectan empresas con múltiples instituciones financieras.23 El proceso técnico para que una aplicación de un tercero inicie un pago suele seguir estos pasos:

* **Integración de API**: El comercio integra la infraestructura del agregador en su sitio web o aplicación móvil.22  
* **Selección de Entidad**: El cliente final elige su banco de una lista proporcionada por el sistema.23  
* **Autenticación Redirigida**: El usuario es redirigido al canal seguro de su propio banco para iniciar sesión y autenticarse mediante factores de seguridad robustos (biometría, tokens).23  
* **Autorización y Movimiento**: Una vez confirmado el pago por el cliente, los fondos se transfieren en tiempo real de la cuenta origen a la cuenta destino, notificando a ambas partes de inmediato.22

Este modelo es considerado seguro porque las aplicaciones de terceros no almacenan las credenciales bancarias del cliente; estas son procesadas directamente por la entidad financiera a través de canales cifrados.23 La ventaja competitiva es clara: reducción o eliminación de comisiones de adquirencia, confirmación inmediata y una experiencia de usuario que no requiere abandonar el entorno de compra del comercio.22

### **Segmentación del Sector Fintech en Costa Rica (Mapeo BID)**

| Segmento Fintech | Funcionalidad Principal | Ejemplos / Estado del Arte |
| :---- | :---- | :---- |
| Pagos (Paytech) | Soluciones para transmisión de dinero, remesas y billeteras digitales.24 | Zunify (pagos QR), Tilopay (pasarelas), Monibyte.25 |
| Crédito Digital | Plataformas de financiación alternativa y préstamos en línea.24 | Bdigital, Multimoney (financiera con enfoque digital).25 |
| Gestión Financiera | Herramientas para la gestión contable y patrimonial de pymes y personas.24 | Impesa (BFM), Lysto Card.25 |
| Infraestructura | Proveedores tecnológicos de servicios para banca digital y APIs.24 | Prometeo (agregación bancaria e iniciación de pagos).23 |

La expansión de estas empresas ha sido facilitada por el alto nivel de digitalización en Costa Rica. El 60% de la población adulta ha realizado o recibido pagos móviles, cifra superior a la media de América Latina (45%).24 Sin embargo, el 30% de la población aún no posee cuenta bancaria, lo que representa un "vasto terreno" para la inclusión financiera mediante aplicaciones que logren bajar las barreras de entrada al sistema formal.21

## **Retos Técnicos: Del Screen Scraping a la Estandarización**

En el debate sobre la conexión de terceros, surge con frecuencia el concepto de *screen scraping* (extracción de datos web). Esta técnica consiste en que un software informático captura datos y tarifas directamente desde el portal web del banco, utilizando las credenciales del usuario.27 Aunque se utiliza en aplicaciones de comparación de precios e integración de servicios, es una práctica que genera controversia por sus riesgos de seguridad y estabilidad.27

### **Comparativa: Screen Scraping vs. APIs Estandarizadas**

| Característica | Screen Scraping (Rastreo de Pantalla) | APIs Estandarizadas (Open Banking) |
| :---- | :---- | :---- |
| **Seguridad** | Requiere compartir credenciales maestras con el tercero.27 | Utiliza tokens de acceso limitados y consentimientos granulares.16 |
| **Fiabilidad** | Se rompe si el banco cambia el diseño de su web.5 | Estable, basada en contratos técnicos de largo plazo.15 |
| **Eficiencia** | Consume muchos recursos del servidor al simular un usuario.5 | Comunicación optimizada de máquina a máquina (JSON).6 |
| **Control** | El banco no sabe qué datos está extrayendo el software. | El banco controla exactamente qué puntos de datos expone. |

La verdadera interoperabilidad bancaria requiere estándares claros, como el uso de formatos ISO 20022 o JSON y protocolos de mensajería comunes.5 En Costa Rica, el BCCR ha comenzado a publicar documentación técnica para el acceso automatizado a datos públicos (índices crediticios, curvas de rendimiento, tipos de cambio) mediante APIs.29 La SUGEF también cuenta con una API (v1.2) para que aplicaciones externas extraigan informes financieros, catálogos de cuentas y estados de situación, utilizando la especificación OpenAPI 3.0 (OAS 3.0).6 Estos son los primeros pasos institucionales hacia una infraestructura compartida más allá de la simple comunicación por archivos planos.

## **Perspectivas Legislativas y el Futuro de la Economía Digital**

El marco legal actual se percibe como insuficiente para los innovadores, lo que ha motivado la presentación de diversos proyectos de ley en la Asamblea Legislativa. Uno de los más relevantes es el Expediente No. 23.415, "Ley de Mercado de Criptoactivos", el cual pretende dar certeza jurídica a las actividades que involucren tecnología Blockchain y activos virtuales.30

Aunque este proyecto se centra en criptoactivos, su discusión ha permeado la necesidad de una regulación fintech integral que evite que las empresas operen en una "zona gris" o bajo marcos regulatorios tradicionales que no se adecúan a la tecnología.30 Se busca que Costa Rica no pierda competitividad frente a mercados como Brasil, Colombia o México, que ya cuentan con leyes fintech o normativas de banca abierta establecidas.30

### **Elementos Clave de la Discusión Legislativa 2024-2026**

* **Interoperabilidad Obligatoria**: Existe la propuesta de crear marcos regulatorios que promuevan la interoperabilidad bancaria para garantizar la compatibilidad entre el mundo financiero tradicional y los nuevos jugadores tecnológicos.32  
* **Identidad Digital**: El desarrollo de sistemas de identidad legal digital confiables y precisos se considera un pilar para la infraestructura pública digital que facilitaría el "onboarding" de clientes en aplicaciones de terceros.33  
* **Sandboxes Regulatorios**: La creación de espacios controlados para poner a prueba iniciativas financieras innovadoras, permitiendo el aprendizaje conjunto entre el regulador y el emprendedor.34  
* **Soberanía de Datos**: El refuerzo de que el cliente tiene y ejerce el derecho sobre sus datos, pudiendo gestionarlos de forma fácil, segura y transparente a través de proveedores autorizados.35

El Banco Central mantiene un enfoque "tolerante y vigilante" frente a las nuevas tecnologías, permitiendo la circulación de activos digitales mientras no afecten la estabilidad monetaria del país.30 Esta postura pragmática sugiere que, si bien no hay una obligación inmediata de abrir los datos, el regulador no cerrará las puertas a modelos de negocio que demuestren ser seguros y beneficiosos para la inclusión financiera.

## **Impacto Económico y Eficiencia Operativa de la Conectividad**

La adopción de sistemas interoperables como SINPE Móvil ya ha demostrado beneficios tangibles en la estructura de costos del sistema bancario costarricense. Análisis del Banco de Pagos Internacionales (BIS) sugieren que la expansión de los pagos rápidos ha estado asociada con una reducción marcada en el ratio de gastos no financieros sobre el ingreso bruto del sistema bancario.2

### **Indicadores de Eficiencia y Adopción (Contexto 2024-2026)**

| Indicador Económico / Financiero | Valor / Observación |
| :---- | :---- |
| Costo de Transacciones SINPE Móvil | Gratuitas para clientes hasta ₡100.000 diarios (envío) y ₡2.000.000 mensuales (recibo).3 |
| Valor Promedio de Transacción | ₡16.900 (aprox. $34 USD), lo que indica uso para necesidades diarias.2 |
| Población Bancarizada | 50.4% (ABC/Banco Mundial), el segundo país con mayor porcentaje de la región.36 |
| Reducción de Costos Bancarios | Brecha significativa de eficiencia lograda post-pandemia gracias a la digitalización.2 |
| Proyección de Inflación (2025-2026) | Se espera estabilidad dentro de la meta del BCCR, favoreciendo la inversión digital.37 |

La interoperabilidad real permite eliminar silos de datos, reducir demoras en pagos y redirigir presupuestos de procesos manuales hacia la innovación.5 Para los bancos, conectar con aplicaciones de terceros no es solo una amenaza competitiva, sino una oportunidad estratégica para actuar como proveedores de infraestructura (Banking as a Service) y diversificar sus fuentes de ingresos mediante la monetización de sus APIs.38

## **Seguridad, Fraude y el Factor de la Confianza del Consumidor**

La seguridad es el argumento central de quienes defienden la cautela en la apertura de datos. El Banco Nacional ha lanzado campañas como "Doña Confiada" para educar a la población sobre los riesgos de los fraudes digitales, enlaces falsos y estafas telefónicas.39 En un entorno donde las transacciones son inmediatas e irrevocables, la suplantación de identidad en una aplicación de un tercero podría tener consecuencias financieras devastadoras para el usuario.22

Las entidades supervisadas deben implementar mecanismos de autenticación reforzada del cliente (SCA), basados en dos o más factores independientes.40 Además, el Reglamento del Sistema de Pagos obliga a los afiliados a mantener actualizados sus certificados digitales de firma electrónica y sellos electrónicos para garantizar la integridad de los comprobantes de transacción.7 Cualquier aplicación de un tercero que pretenda procesar pagos debe estar preparada para integrarse con estos protocolos de seguridad de grado bancario.

### **Estándares de Seguridad Exigidos para la Integración**

1. **Cifrado de Extremo a Extremo**: Los datos deben estar protegidos desde el momento en que el usuario los ingresa en la aplicación del tercero hasta que llegan al banco.5  
2. **Consentimiento Granular**: El usuario debe poder autorizar accesos específicos (ej. solo ver saldos, pero no realizar transferencias) y por periodos de tiempo delimitados.16  
3. **Trazabilidad**: Todas las transacciones originadas por terceros deben llevar códigos de referencia únicos que permitan auditorías posteriores por parte del BCCR o la SUGEF.4  
4. **Validación de Identidad Robusta**: Las entidades origen y destino son responsables de verificar que el nombre, identificación e IBAN coincidan plenamente antes de liberar fondos.4

## **Conclusiones: Hacia un Modelo de Finanzas Abiertas en Costa Rica**

La investigación exhaustiva permite concluir que la conexión entre bancos y aplicaciones de terceros en Costa Rica es una realidad técnica en pleno desarrollo, pero se encuentra operando dentro de un marco de "permisividad controlada" en lugar de un mandato de banca abierta. La infraestructura de pagos (SINPE) está preparada para la interoperabilidad total y ya soporta volúmenes masivos de transacciones inmediatas. Sin embargo, el acceso directo a estos rieles de pago sigue estando reservado para entidades supervisadas, lo que obliga a las fintechs a buscar alianzas estratégicas o integrarse a través de portales de APIs corporativas.

El marco legal de protección de datos (Ley 8968\) faculta al cliente para autorizar el flujo de su información, pero la rigidez del secreto bancario (Ley 7558\) y las penas de prisión asociadas a su violación actúan como un freno potente para los funcionarios bancarios que deben decidir sobre la apertura de sus sistemas. Para que Costa Rica alcance un modelo de Open Finance comparable al de los líderes globales, se requiere una reforma legal que clarifique las responsabilidades de cada actor en la cadena de custodia de datos y establezca estándares técnicos de cumplimiento obligatorio.

Para 2026, la tendencia sugiere que la presión del mercado y la necesidad de mayor inclusión financiera forzarán la creación de una ley fintech o una normativa específica del CONASSIF que regule la figura del iniciador de pagos y el agregador de cuentas. Mientras tanto, el éxito de la conectividad en Costa Rica seguirá dependiendo de la capacidad de las fintechs para demostrar niveles de seguridad equivalentes a la banca tradicional y de la voluntad de los bancos líderes para abrir sus ecosistemas como una vía para mejorar su propia eficiencia operativa y la experiencia de sus clientes. El país tiene todos los ingredientes —conectividad, bancarización y madurez digital— para convertirse en el hub financiero digital de Centroamérica, siempre que logre equilibrar su histórica prudencia regulatoria con la ineludible necesidad de innovación abierta.

#### **Obras citadas**

1. Regulations \- BCCR, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/en/legal-framework/regulations](https://www.bccr.fi.cr/en/legal-framework/regulations)  
2. Fast payments and banking: Costa Rica's SINPE Móvil \- BIS, fecha de acceso: febrero 24, 2026, [https://www.bis.org/publ/bppdf/bispap152\_d\_rh.pdf](https://www.bis.org/publ/bppdf/bispap152_d_rh.pdf)  
3. SINPE Móvil \- BCCR, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/sistema-de-pagos/servicios-brindados-a-clientes/sinpe-m%C3%B3vil](https://www.bccr.fi.cr/sistema-de-pagos/servicios-brindados-a-clientes/sinpe-m%C3%B3vil)  
4. Reglamento del sistema de pagos del Banco Central de Costa Rica \- PGR, fecha de acceso: febrero 24, 2026, [https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm\_texto\_completo.aspx?param1=NRTC\&nValor1=1\&nValor2=80449\&nValor3=114454\&strTipM=TC](https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=80449&nValor3=114454&strTipM=TC)  
5. Interoperabilidad bancaria: ¿qué es y cómo implementarla? \- Topaz, fecha de acceso: febrero 24, 2026, [https://www.topazevolution.com/es/blog/interoperabilidad-bancaria](https://www.topazevolution.com/es/blog/interoperabilidad-bancaria)  
6. Reportes Sitio Web API v1.2 \- SUGEF, fecha de acceso: febrero 24, 2026, [https://www.sugef.fi.cr/Bccr.Sugef.Reportes\_SitioWeb.API/archivos/Manual%20de%20Usuario%20SUGEF%20-%20Reportes%20Sitio%20Web%20API%20v1.2.pdf](https://www.sugef.fi.cr/Bccr.Sugef.Reportes_SitioWeb.API/archivos/Manual%20de%20Usuario%20SUGEF%20-%20Reportes%20Sitio%20Web%20API%20v1.2.pdf)  
7. Reglamento del sistema de pagos del Banco Central de Costa Rica \- PGR, fecha de acceso: febrero 24, 2026, [https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm\_texto\_completo.aspx?param1=NRTC\&nValor1=1\&nValor2=80449\&nValor3=145091\&strTipM=TC](https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=80449&nValor3=145091&strTipM=TC)  
8. La Junta Directiva del Banco Central de Costa Rica, en el artículo 7 del acta de la sesión, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/marco-legal/DocAcuerdosJuntaDirectiva/BCCR\_6240\_2025\_Art7.pdf](https://www.bccr.fi.cr/marco-legal/DocAcuerdosJuntaDirectiva/BCCR_6240_2025_Art7.pdf)  
9. Ley de Protección de la Persona frente al tratamiento de sus datos personales \- Pgrweb.go.cr, fecha de acceso: febrero 24, 2026, [https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm\_texto\_completo.aspx?param1=NRTC\&nValor1=1\&nValor2=70975\&nValor3=85989\&strTipM=TC](https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=70975&nValor3=85989&strTipM=TC)  
10. Ley nº 8968, de 7 de julio de 2011, Protección de la Persona frente al tratamiento de sus datos personales | RIPD, fecha de acceso: febrero 24, 2026, [https://www.redipd.org/legislacion/ley-8968](https://www.redipd.org/legislacion/ley-8968)  
11. Ley de Protección de la Persona frente al tratamiento de sus datos personales \- Centro Virtual de Formación, fecha de acceso: febrero 24, 2026, [https://www.inavirtual.ed.cr/pluginfile.php/2976041/mod\_folder/content/0/Ley%20N%C2%B08968.pdf?forcedownload=1](https://www.inavirtual.ed.cr/pluginfile.php/2976041/mod_folder/content/0/Ley%20N%C2%B08968.pdf?forcedownload=1)  
12. La Ley No. 8968 de 2011 de Costa Rica, para asegurar la privacidad de los datos, fecha de acceso: febrero 24, 2026, [https://caseguard.com/es/articles/la-ley-no-8968-de-2011-de-costa-rica-para-asegurar-la-privacidad-de-los-datos/](https://caseguard.com/es/articles/la-ley-no-8968-de-2011-de-costa-rica-para-asegurar-la-privacidad-de-los-datos/)  
13. CIRCULAR EXTERNA SGF-2297-2025 SGF-PUBLICO 17 ... \- Sugef, fecha de acceso: febrero 24, 2026, [https://www.sugef.fi.cr/informacion\_relevante/circulares/externas%20vigentes/SGF-2297-2025.pdf](https://www.sugef.fi.cr/informacion_relevante/circulares/externas%20vigentes/SGF-2297-2025.pdf)  
14. Presentación FATCA 02-12-2014 \- BCCR, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/publicaciones/DocFatca/Presentacion\_Contactos\_Entidades\_02122014.pptx](https://www.bccr.fi.cr/publicaciones/DocFatca/Presentacion_Contactos_Entidades_02122014.pptx)  
15. BAC API Center: bienvenidos, fecha de acceso: febrero 24, 2026, [https://developers.baccredomatic.com/](https://developers.baccredomatic.com/)  
16. APIs BAC, fecha de acceso: febrero 24, 2026, [https://www.baccredomatic.com/empresas/api-tesoreria-corporativa-digital](https://www.baccredomatic.com/empresas/api-tesoreria-corporativa-digital)  
17. Scotia TranXact™ APIs \- Developer Portal, fecha de acceso: febrero 24, 2026, [https://developer.scotiabank.com/en/products/Payments-and-Cash-Management-APIs.html](https://developer.scotiabank.com/en/products/Payments-and-Cash-Management-APIs.html)  
18. Home | Developer Portal – Scotiabank, fecha de acceso: febrero 24, 2026, [https://developer.scotiabank.com/en.html](https://developer.scotiabank.com/en.html)  
19. FAQ \- Developer Portal, fecha de acceso: febrero 24, 2026, [https://developer.scotiabank.com/en/support/faq.html](https://developer.scotiabank.com/en/support/faq.html)  
20. Getting Started \- Developer Portal, fecha de acceso: febrero 24, 2026, [https://developer.scotiabank.com/en/getting-started.html](https://developer.scotiabank.com/en/getting-started.html)  
21. Fintech en Costa Rica: Impulso a la inclusión financiera a través de la tecnología \- IT NOW, fecha de acceso: febrero 24, 2026, [https://www.itnow.connectab2b.com/post/fintech-en-costa-rica-impulso-a-la-inclusi%C3%B3n-financiera-a-trav%C3%A9s-de-la-tecnolog%C3%ADa](https://www.itnow.connectab2b.com/post/fintech-en-costa-rica-impulso-a-la-inclusi%C3%B3n-financiera-a-trav%C3%A9s-de-la-tecnolog%C3%ADa)  
22. Fabrick Pay by Bank, fecha de acceso: febrero 24, 2026, [https://www.fabrick.com/es-es/productos/pay-by-bank/](https://www.fabrick.com/es-es/productos/pay-by-bank/)  
23. Iniciación de pagos: ¿Qué es y cómo lo hacemos en Prometeo ..., fecha de acceso: febrero 24, 2026, [https://prometeoapi.com/blog/iniciacion-de-pagos-prometeo](https://prometeoapi.com/blog/iniciacion-de-pagos-prometeo)  
24. FINTECH en Costa Rica \- Publications, fecha de acceso: febrero 24, 2026, [https://publications.iadb.org/publications/spanish/document/FINTECH\_en\_Costa\_Rica\_Hacia\_una\_evoluci%C3%B3n\_de\_los\_servicios\_financieros\_es\_es.pdf](https://publications.iadb.org/publications/spanish/document/FINTECH_en_Costa_Rica_Hacia_una_evoluci%C3%B3n_de_los_servicios_financieros_es_es.pdf)  
25. Costa Rica \- Latam Fintech Hub, fecha de acceso: febrero 24, 2026, [https://www.latamfintech.co/countries/costa-rica](https://www.latamfintech.co/countries/costa-rica)  
26. Página 1 de 13 Uso Interno INFORMA AL PÚBLICO: 1\. ENTIDADES SUPERVISADAS POR LA SUGEF ACTUALIZADA AL 30 DE ENERO DE 2026 1.1 B, fecha de acceso: febrero 24, 2026, [https://www.sugef.fi.cr/entidades\_supervisadas/lista\_entidades\_supervisadas/entidades\_fiscalizadas/actual/2026\_01.pdf](https://www.sugef.fi.cr/entidades_supervisadas/lista_entidades_supervisadas/entidades_fiscalizadas/actual/2026_01.pdf)  
27. LA GACETA N° 225 DEL 08 DE MARZO DEL 2020, fecha de acceso: febrero 24, 2026, [https://www.imprentanacional.go.cr/pub/2020/09/08/COMP\_08\_09\_2020.html](https://www.imprentanacional.go.cr/pub/2020/09/08/COMP_08_09_2020.html)  
28. LA GACETA N° 245 DEL 7 DE OCTUBRE DEL 2020 \- Imprenta Nacional, fecha de acceso: febrero 24, 2026, [https://www.imprentanacional.go.cr/pub/2020/10/07/COMP\_07\_10\_2020.html](https://www.imprentanacional.go.cr/pub/2020/10/07/COMP_07_10_2020.html)  
29. Indicadores Económicos \- BCCR, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/indicadores-economicos/Paginas/APIs.aspx](https://www.bccr.fi.cr/indicadores-economicos/Paginas/APIs.aspx)  
30. De conformidad con las disposiciones del artículo 113 del Reglamento de la Asamblea Legislativa, el Departamento Secretaría de \- Cloudfront.net, fecha de acceso: febrero 24, 2026, [https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2022/10/23415.pdf](https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2022/10/23415.pdf)  
31. Panorama FinTech Centroamérica 2023 \- Managua \- UAF, fecha de acceso: febrero 24, 2026, [https://www.uaf.gob.ni/images/Pdf/Documentos\_ALA-CFT/PANORAMA-FINTECH\_CA-2023.pdf](https://www.uaf.gob.ni/images/Pdf/Documentos_ALA-CFT/PANORAMA-FINTECH_CA-2023.pdf)  
32. LEY DE CRIPTO: QUE HACE A LA REPUBLICA DE PANAMA COMPATIBLE CON LA ECONOMIA DIGITAL, EL BLOCKCHAIN, LOS CRIPTOACTIVOS Y EL INTER \- Centro de Estudios Regulatorios, fecha de acceso: febrero 24, 2026, [https://www.cerlatam.com/wp-content//uploads/2022/05/Proyecto-de-Ley-No.697.pdf](https://www.cerlatam.com/wp-content//uploads/2022/05/Proyecto-de-Ley-No.697.pdf)  
33. Diagnóstico de Preparación Digital en El Salvador 2024-2025: Avanzar sistemáticamente hacia un futuro digital | UNDP, fecha de acceso: febrero 24, 2026, [https://www.undp.org/sites/g/files/zskgke326/files/2025-07/reporte\_digital\_readiness\_assessment\_2.0\_elsv\_2024-2025\_web.pdf](https://www.undp.org/sites/g/files/zskgke326/files/2025-07/reporte_digital_readiness_assessment_2.0_elsv_2024-2025_web.pdf)  
34. REGULACIÓN FINTECH EN LATINOAMÉRICA \- Lloreda Camacho, fecha de acceso: febrero 24, 2026, [https://lloredacamacho.com/wp-content/uploads/2023/02/LATAMFINTECHREGULATION-ES-140223.pdf](https://lloredacamacho.com/wp-content/uploads/2023/02/LATAMFINTECHREGULATION-ES-140223.pdf)  
35. IX Informe \- Tendencias en Medios de Pago \- AMIC, fecha de acceso: febrero 24, 2026, [https://www.amic.media/media/files/file\_352\_2279.pdf](https://www.amic.media/media/files/file_352_2279.pdf)  
36. Costa Rica es el segundo país con más población bancarizada de Latinoamérica, fecha de acceso: febrero 24, 2026, [https://www.paymentmedia.com/news-1013-costa-rica-es-el-segundo-pas-con-ms-poblacin-bancarizada-de-latinoamrica.html](https://www.paymentmedia.com/news-1013-costa-rica-es-el-segundo-pas-con-ms-poblacin-bancarizada-de-latinoamrica.html)  
37. Informe de Política Monetaria \- Julio 2025 \- BCCR, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/publicaciones/DocPolticaMonetariaInflacin/Documento-IPM-Julio-2025.pdf](https://www.bccr.fi.cr/publicaciones/DocPolticaMonetariaInflacin/Documento-IPM-Julio-2025.pdf)  
38. Banca API 101: qué es y cómo funciona \- Stripe, fecha de acceso: febrero 24, 2026, [https://stripe.com/es/resources/more/api-banking-101](https://stripe.com/es/resources/more/api-banking-101)  
39. BNCR, fecha de acceso: febrero 24, 2026, [https://www.bncr.fi.cr/](https://www.bncr.fi.cr/)  
40. Reglamento del Sistema de Pagos \- BCCR, fecha de acceso: febrero 24, 2026, [https://www.bccr.fi.cr/marco-legal/DocReglamento/Reglamento\_Sistema\_Pagos.pdf](https://www.bccr.fi.cr/marco-legal/DocReglamento/Reglamento_Sistema_Pagos.pdf)