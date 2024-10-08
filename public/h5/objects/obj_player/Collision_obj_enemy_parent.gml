/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 1362B03B
/// @DnDComment : If Alarm 0 is deactivated
/// @DnDArgument : "var" "alarm[0]"
/// @DnDArgument : "op" "1"
if(alarm[0] < 0)
{
	/// @DnDAction : YoYo Games.Common.Variable
	/// @DnDVersion : 1
	/// @DnDHash : 0A333880
	/// @DnDComment : This event runs when you$(13_10)touch an enemy$(13_10)$(13_10)This action will set the move_speed$(13_10)to 0 so the player can't move anymore
	/// @DnDParent : 1362B03B
	/// @DnDArgument : "var" "move_speed"
	move_speed = 0;

	/// @DnDAction : YoYo Games.Instances.Color_Sprite
	/// @DnDVersion : 1
	/// @DnDHash : 1003E78C
	/// @DnDComment : Set the color to red to show the player$(13_10)has lost
	/// @DnDParent : 1362B03B
	/// @DnDArgument : "colour" "$FF0000FF"
	image_blend = $FF0000FF & $ffffff;
	image_alpha = ($FF0000FF >> 24) / $ff;

	/// @DnDAction : YoYo Games.Audio.Play_Audio
	/// @DnDVersion : 1
	/// @DnDHash : 764ECBC6
	/// @DnDComment : Play "hurt" sound
	/// @DnDParent : 1362B03B
	/// @DnDArgument : "soundid" "snd_hurt"
	/// @DnDSaveInfo : "soundid" "snd_hurt"
	audio_play_sound(snd_hurt, 0, 0);

	/// @DnDAction : YoYo Games.Instances.Set_Alarm
	/// @DnDVersion : 1
	/// @DnDHash : 5641C2B6
	/// @DnDComment : Tell the Alarm 0 event to run after 20 frames$(13_10)$(13_10)After 20 frames that event will restart the level
	/// @DnDParent : 1362B03B
	/// @DnDArgument : "steps" "20"
	alarm_set(0, 20);
}