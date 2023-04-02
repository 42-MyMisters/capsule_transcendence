import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IntraUserDto } from "./dto/IntraUserDto";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { PasswordDto } from "./dto/PasswordDto";
import config from "config";
import { UserFollower } from "./user-follower.entity";
import { UserFollowing } from "./user-following.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private userFollowerRepository: Repository<UserFollower>,
		private userFollowingRepository: Repository<UserFollowing>,
		private jwtService: JwtService,
	){}

	async addNewUser(intraUserDto: IntraUserDto): Promise<User> {
		const user: User = await User.fromIntraUserDto(intraUserDto);
		user.password = 'null';
		user.token = 'null';
		user.twoFactorSecret = 'null';
		await this.userRepository.save(user);
		return user;
	}

	async getUserById(uid: number) {
		const user = await this.userRepository.findOneBy({uid});
		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.userRepository.findOneBy({email});
		return user;
	}
	
	async showUsers() {
		const users = await this.userRepository.find({ relations: ["wonGames", "lostGames", "followers", "followings"] });
		return users;
	}

	async setUserPw(user: User, pw: PasswordDto) {
		const userUpdate = user;
		const userPw = await bcrypt.hash(pw.password, config.get<number>('hash.password.saltOrRounds'));
		userUpdate.password = userPw;
		await this.updateUser(userUpdate);
	}

	async updateUser(user: User) {
		const userUpdate = user;
		await this.userRepository.save(userUpdate);
	}

	isUserExist = (user: User | null): user is User => {
		return user !== null;
	}

}