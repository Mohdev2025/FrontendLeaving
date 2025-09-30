import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { Footer } from './component/footer/footer';
import { LeaveApplyComponent} from './pages/leave-apply/leave-apply';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, LeaveApplyComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('test');
}
