import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { RolesService } from '../../services/roles.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

  user!: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id')!;
    this.usersService.getUserById(userId).subscribe(user => {
      console.log(user);
      this.user = user;
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  goUpdate() {
    if (this.user) {
      this.router.navigate(['/users/edit', this.user.id]);
    } else {
      console.error('User is undefined');
    }
  }


}
