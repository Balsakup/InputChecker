# Input Checker

## Pourquoi ?
Lors de mon stage de développeur, j'avais besoin de faire une vérification sur plusieurs formulaires, au lieu de faire 40000 lignes de vérification pour chaque formulaire, j'ai décidé de faire un plugin jQuery.
Ce plugin permet de faire des vérifications sur n'importe quel formulaire (enfin pour l'instant il est pas super développé, il est juste développé pour coller à mon projet de stage).

## Fonctionnalités
Lors que vous créez un formulaire, vous avez juste à ajouter des attributs sur les champs et sur certains boutons (submit et bouton de test si y'a).
Avec ces nouveaux attributs, le plugin (une fois instancié) détectera automatiquement les champs à vérifier, puis nous notifira des erreurs de vérification ou de test dans le cas où il y a des tests.

## Test
Les tests permettent de vérifier la valeur d'un champ avec un appel **Ajax** vers un fichier ou une URL. C'est à vous de rédiger le test. Je ne peux pas savoir ce que va retourner votre serveur ou votre fichier.

## Comment ça marche ?
Rendez-vous ici [https://balsakup.github.io/InputChecker](https://balsakup.github.io/InputChecker) pour tester :wink:

Première chose important. Ce plugin est un plugin jQuery, il a donc besoin de ? .............. jQuery !!!

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
```

Ensuite vous devez indiquer les champs à vérifier à l'aide de l'attribut
Les attributs disponibles
- sur les inputs
    - data-ic
        - Permet de définir un champ à vérifier
    - data-ic-rules
        - **notempty** pas vide
        - **numeric** numérique
        - **length-[n]** d'une longeur de n caractères (sans les crochets)
        - **min-[n]** minimum n caractères (sans les crochets)
        - **max-[n]** maximum n caractères (sans les crochets)
    - data-ic-message
        - Message d'erreur
    - data-ic-test="url"
        - Définie un champ qui a besoin de tester sa valeur en appelant auprès de l'url
- sur les boutons
    - data-ic-test-btn
        - Définie le bouton qui lance les tests sur les champs
    - data-ic-submit
        - Permet de localiser le bouton d'envoie du formulaire


Exemple
```html
<input data-ic data-ic-rules="notempty|numeric|length-4" data-ic-message="Champ non valide" data-ic-test="/test.json" type="text" name="input">
<button data-ic-test-btn type="button">Tester</button>
<button data-ic-submit type="submit">Valider</button>
```


Ensuite, il faut importer le plugin

```html
<script src="js/jquery.inputChecker.js"></script>
```

Une fois ces importations faites, c'est à vous de configurer à votre guise

```javascript
$('form').inputChecker({
    inputParent   : '.form-group',                // La classe du parent de l'input
    errorClass    : 'has-error',                  // La classe à coller en cas d'erreur
    successClass  : 'has-success',                // La classe à coller en cas de success des tests
    helpBlockClass: 'help-block',                 // La classe pour les messages d'erreur et de succès
    inputEvents   : [ 'change', 'keyup' ],        // Les événements déclancheurs (submit est déjà prit en compte)
    onSuccess     : function () {                 // Callback en cas de succès du formulaire
        console.log('Sucess !');
    },
    onError       : function () {                 // Callback en cas d'erreur du formulaire
        console.error('Error !');
    },
    onTest        : function (data, value) {      // Fonction de test (Seulement un test pour l'instant)
        var result = false;
            
        $.each(data, function () {
            result = result || this.value == value;
        });
          
        return result;
    }
});
```
