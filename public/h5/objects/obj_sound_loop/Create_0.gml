/// @DnDAction : YoYo Games.Audio.Play_Audio
/// @DnDVersion : 1
/// @DnDHash : 5C436BFD
/// @DnDComment : This object can be placed anywhere in the room$(13_10)and a sound asset can be assigned to its$(13_10)"sound_to_loop" variable (see the Variable Definitions$(13_10)window).$(13_10)$(13_10)This action plays that sound and stores the ID of the$(13_10)played sound in the "my_sound" variable.
/// @DnDArgument : "target" "my_sound"
/// @DnDArgument : "soundid" "sound_to_loop"
/// @DnDArgument : "loop" "1"
my_sound = audio_play_sound(sound_to_loop, 0, 1);