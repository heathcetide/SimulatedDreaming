/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 08D76482
/// @DnDComment : If the enemy is attacking,
/// @DnDArgument : "var" "attacking"
/// @DnDArgument : "value" "true"
if(attacking == true)
{
	/// @DnDAction : YoYo Games.Common.Exit_Event
	/// @DnDVersion : 1
	/// @DnDHash : 346DCE7E
	/// @DnDComment : Stop the event so its$(13_10)sprite is not changed
	/// @DnDParent : 08D76482
	exit;
}

/// @DnDAction : YoYo Games.Common.Temp_Variable
/// @DnDVersion : 1
/// @DnDHash : 4585D4D1
/// @DnDComment : Get the X speed of the baddie by$(13_10)subtracting the current X position$(13_10)from the previous X position
/// @DnDArgument : "var" "speed_x"
/// @DnDArgument : "value" "x - xprevious"
var speed_x = x - xprevious;

/// @DnDAction : YoYo Games.Common.Temp_Variable
/// @DnDVersion : 1
/// @DnDHash : 783E0AF7
/// @DnDComment : Get the Y speed of the baddie by$(13_10)subtracting the current Y position$(13_10)from the previous Y position
/// @DnDArgument : "var" "speed_y"
/// @DnDArgument : "value" "y - yprevious"
var speed_y = y - yprevious;

/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 3F5C2EAF
/// @DnDComment : This condition checks if the baddie$(13_10)is moving right
/// @DnDArgument : "var" "speed_x"
/// @DnDArgument : "op" "4"
/// @DnDArgument : "value" "1"
if(speed_x >= 1)
{
	/// @DnDAction : YoYo Games.Instances.Sprite_Scale
	/// @DnDVersion : 1
	/// @DnDHash : 01367DA5
	/// @DnDComment : In that case we reset the horizontal$(13_10)scale
	/// @DnDParent : 3F5C2EAF
	image_xscale = 1;
	image_yscale = 1;

	/// @DnDAction : YoYo Games.Instances.Set_Sprite
	/// @DnDVersion : 1
	/// @DnDHash : 3371E80C
	/// @DnDComment : and change the sprite to the side walking$(13_10)sprite
	/// @DnDParent : 3F5C2EAF
	/// @DnDArgument : "imageind_relative" "1"
	/// @DnDArgument : "spriteind" "spr_baddie_walk_side"
	/// @DnDSaveInfo : "spriteind" "spr_baddie_walk_side"
	sprite_index = spr_baddie_walk_side;
	image_index += 0;
}

/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 5CB1A00B
/// @DnDComment : If baddie is moving left
/// @DnDArgument : "var" "speed_x"
/// @DnDArgument : "op" "3"
/// @DnDArgument : "value" "-1"
if(speed_x <= -1)
{
	/// @DnDAction : YoYo Games.Instances.Sprite_Scale
	/// @DnDVersion : 1
	/// @DnDHash : 2B5D94D7
	/// @DnDComment : Set horizontal scale to -1 to flip it
	/// @DnDParent : 5CB1A00B
	/// @DnDArgument : "xscale" "-1"
	image_xscale = -1;
	image_yscale = 1;

	/// @DnDAction : YoYo Games.Instances.Set_Sprite
	/// @DnDVersion : 1
	/// @DnDHash : 55B581D9
	/// @DnDComment : Set side walking sprite
	/// @DnDParent : 5CB1A00B
	/// @DnDArgument : "imageind_relative" "1"
	/// @DnDArgument : "spriteind" "spr_baddie_walk_side"
	/// @DnDSaveInfo : "spriteind" "spr_baddie_walk_side"
	sprite_index = spr_baddie_walk_side;
	image_index += 0;
}

/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 0CD341FD
/// @DnDComment : If baddie is moving down
/// @DnDArgument : "var" "speed_y"
/// @DnDArgument : "op" "4"
/// @DnDArgument : "value" "1"
if(speed_y >= 1)
{
	/// @DnDAction : YoYo Games.Instances.Set_Sprite
	/// @DnDVersion : 1
	/// @DnDHash : 3D0AB553
	/// @DnDComment : Set that sprite
	/// @DnDParent : 0CD341FD
	/// @DnDArgument : "imageind_relative" "1"
	/// @DnDArgument : "spriteind" "spr_baddie_walk_down"
	/// @DnDSaveInfo : "spriteind" "spr_baddie_walk_down"
	sprite_index = spr_baddie_walk_down;
	image_index += 0;
}

/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 65CFBBC6
/// @DnDComment : If baddie is moving up
/// @DnDArgument : "var" "speed_y"
/// @DnDArgument : "op" "3"
/// @DnDArgument : "value" "-1"
if(speed_y <= -1)
{
	/// @DnDAction : YoYo Games.Instances.Set_Sprite
	/// @DnDVersion : 1
	/// @DnDHash : 2C661542
	/// @DnDComment : Set that sprite
	/// @DnDParent : 65CFBBC6
	/// @DnDArgument : "imageind_relative" "1"
	/// @DnDArgument : "spriteind" "spr_baddie_walk_up"
	/// @DnDSaveInfo : "spriteind" "spr_baddie_walk_up"
	sprite_index = spr_baddie_walk_up;
	image_index += 0;
}