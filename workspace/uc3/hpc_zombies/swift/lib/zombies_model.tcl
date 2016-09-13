package require turbine 0.1

namespace eval zombies_model {

  proc zombies_model { outs ins args } {
    rule $ins "zombies_model::zombies_model_body $outs {*}$ins" {*}$args type $turbine::WORK
  }

  proc zombies_model_body { z cfg prms } {
    set c [ retrieve_string $cfg ]
    set p [ retrieve_string $prms ]
    # Look up MPI information
    set comm [ turbine::c::task_comm ]
    set rank [ adlb::rank $comm]
    # Run the Zombies model
    set z_value [ zombies_model_run $comm $c $p ]
    if { $rank == 0 } {
      store_string $z $z_value
    }
  }
}
