import { Game } from "src/game/game.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { IntraUserDto } from "./dto/IntraUser.dto";
import { UserBlock } from "./user-block.entity";
import { UserFollow } from "./user-follow.entity";

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn()
	uid: number;

	@Column({nullable: true, type: 'varchar', length: 60})
	password: string | null;

	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	nickname: string;

	@Column({nullable: true, type: 'varchar', length: 60})
	refreshToken: string | null;

	@Column()
	profileUrl: string;

	@Column()
	twoFactorEnabled: boolean;

	@Column({nullable: true, type: 'varchar'})
	twoFactorSecret: string | null; 

	@OneToMany(type => UserFollow, follower => follower.fromUser, { lazy: true })
	followers: UserFollow[];

	@OneToMany(type => UserFollow, following => following.targetToFollow, { lazy: true })
	followings: UserFollow[];

	@OneToMany(type => UserBlock, userBlock => userBlock.targetToBlockId, { lazy: true })
	blockedUsers: UserBlock[];

	@OneToMany(type => Game, games => games.winner, { lazy: true })
	wonGames: Game[];

	@OneToMany(type => Game, games => games.loser, { lazy: true })
	lostGames: Game[];

	@CreateDateColumn()
	createdAt: Date;

	static fromIntraUserDto(intraUserDto: IntraUserDto): User {
		const user = new User();
		user.uid = intraUserDto.id;
		user.email = intraUserDto.email;
		user.nickname = intraUserDto.login + "#" + intraUserDto.id;
		user.profileUrl = intraUserDto.image.link;
		user.twoFactorEnabled = false;
		return user;
	}
}
