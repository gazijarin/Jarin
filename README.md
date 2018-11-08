# Hedronium Homepage

## Add Yourself

### The Markup
You add a bit of markup that defines you into the div with selector `div.faces`

The actual markup follows this general template:
```HTML
<div class="face">
	<div class="pic">
		<img src="{{ PATH TO IMAGE }}" alt="{{ YOUR NAME }}">
	</div>
	<h3>{{ YOUR NAME }}</h3>
	<p>{{ FUNNY QUOTE }}</p>
	<div class="social">
		{{ SOCIAL MEDIA LINKS }}
	</div>
</div>
```
You add a "face" into the "faces" list. Geddit geddit geddit? HUEHUEHUE. *sigh* Nevermind.

While writing your name remember to wrap your primary identifier with emphasis tags (`<em></em>`) this allows the CSS to style
the name you go by as being brighter than the rest of your name. Example:

```HTML
<h3>James <em>Bond<em></h3>
```

Note: Don't be an idiot. Do not add the `em` tags in the `alt` atribute for the image.


### The Image
![NIGUUH DON'T SAY A WORD](./images/faces/shishir.jpg)  
The image should be a square jpg with `200x200 px` dimensions. Anything other 
than a square and you will be pochafied. YOU HAVE BEEN WARNED.

You should store your image in the `images/faces/` directory.

### The Social Links
Just add a anchor tag with the icon class into the `div.social` like:

```HTML
<div class="social">
    <a href="https://facebook.com/zuck" class="icon-facebook" target="_blank"></a>
</div>
```

Add as many links as you F***ING WANT!

Available icon classes:  
- `.icon-fivehundredpx`
- `.icon-bitbucket`
- `.icon-skype`
- `.icon-twitter`
- `.icon-github`
- `.icon-facebook`
- `.icon-youtube`
- `.icon-vimeo`
- `.icon-gplus`
- `.icon-pinterest`
- `.icon-foursquare`
- `.icon-reddit`
- `.icon-blogger`
- `.icon-dribbble`
- `.icon-flickr`
- `.icon-linkedin`
- `.icon-email`
- `.icon-myspace`
- `.icon-wordpress`
- `.icon-stackoverflow`
- `.icon-codepen`
- `.icon-web`
- `.icon-instagram`
- `.icon-behance`
