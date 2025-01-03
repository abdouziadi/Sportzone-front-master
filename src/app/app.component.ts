import { Component, OnInit } from '@angular/core';
import { Router,RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'sportZone';
  constructor(private router:Router) {}
  ngOnInit(): void {
    // let username=localStorage.getItem('username');
    // if (username == null)
    //   this.router.navigate(['login']);
    // else
    //   this.router.navigate(['machines']);
}

}
