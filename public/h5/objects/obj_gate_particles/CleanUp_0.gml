/// @DnDAction : YoYo Games.Particles.Part_Type_Destroy
/// @DnDVersion : 1
/// @DnDHash : 6D4C9AF7
/// @DnDComment : Destroy the light particle type
/// @DnDArgument : "type" "light"
part_type_destroy(light);

/// @DnDAction : YoYo Games.Particles.Part_Emit_Destroy
/// @DnDVersion : 1
/// @DnDHash : 706A6BF5
/// @DnDComment : Destroy the light emitter
/// @DnDArgument : "system" "part_sys"
/// @DnDArgument : "emitter" "light_emitter"
part_emitter_destroy(part_sys, light_emitter);

/// @DnDAction : YoYo Games.Particles.Part_Syst_Destroy
/// @DnDVersion : 1.1
/// @DnDHash : 0683BDDA
/// @DnDComment : Destroy this instance's particle system
/// @DnDArgument : "system" "part_sys"
part_system_destroy(part_sys);