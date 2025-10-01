import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Animation } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class WelcomePage implements OnInit {

  constructor(
    private router: Router,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    // Animar elementos na entrada
    this.animateOnLoad();
  }

  animateOnLoad() {
    // Aguardar o DOM carregar completamente
    setTimeout(() => {
      this.runAnimations();
    }, 100);
  }

  private runAnimations() {
    // Animação do logo
    const logoElement = document.querySelector('.welcome-logo');
    if (logoElement) {
      const logoAnimation = this.animationCtrl
        .create()
        .addElement(logoElement)
        .duration(1000)
        .delay(300)
        .fromTo('transform', 'scale(0) rotate(-180deg)', 'scale(1) rotate(0deg)')
        .fromTo('opacity', '0', '1');
      logoAnimation.play();
    }

    // Animação do título
    const titleElement = document.querySelector('.app-title');
    if (titleElement) {
      const titleAnimation = this.animationCtrl
        .create()
        .addElement(titleElement)
        .duration(800)
        .delay(500)
        .fromTo('transform', 'translateY(50px)', 'translateY(0)')
        .fromTo('opacity', '0', '1');
      titleAnimation.play();
    }

    // Animação dos botões
    const buttonsElement = document.querySelector('.buttons-container');
    if (buttonsElement) {
      const buttonsAnimation = this.animationCtrl
        .create()
        .addElement(buttonsElement)
        .duration(600)
        .delay(800)
        .fromTo('transform', 'translateY(100px)', 'translateY(0)')
        .fromTo('opacity' , '0', '1');
      buttonsAnimation.play();
    }
}
}